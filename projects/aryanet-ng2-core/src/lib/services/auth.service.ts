
import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { BehaviorSubject ,  Observable } from "rxjs";
import { catchError, finalize, map } from "rxjs/operators";

import { AuthTokenType } from "./../models/auth-token-type";
import { AuthUserModel } from "./../models/auth-user.model";
import { RegisterDto } from "./../models/register.dto";
import { CredentialsDto } from "./../models/credentials.dto";
import { LoginDto, VerifyDto } from "./../models/login.dto";
import { AppConfigModel } from "./../models/app-config.model";
import { UrlHelper } from "./../utils/url-helper";
import { BaseService } from "./base.service";
import { AppConfigService } from "./app-config.service";
import { RefreshTokenService } from "./refresh-token.service";
import { TokenStoreService } from "./token-store.service";


@Injectable()
export class AuthService extends BaseService {

  private authStatusSource = new BehaviorSubject<boolean>(false);
  authStatus$ = this.authStatusSource.asObservable();

  constructor(
    private router: Router,
    private tokenStoreService: TokenStoreService,
    private refreshTokenService: RefreshTokenService
  ) {

    super(UrlHelper.Account);
    this.updateStatusOnPageRefresh();
    this.refreshTokenService.scheduleRefreshToken(this.isAuthUserLoggedIn());
  }


  login(credentials: LoginDto): Observable<boolean> {

    return this
      .post(credentials, UrlHelper.Login)
      .pipe(
        map((response: CredentialsDto) => {
          this.tokenStoreService.setRememberMe(credentials.rememberMe);
          if (!response) {

            // console.error("There is no `{'" + this.appConfigService.config.accessTokenObjectKey +
            //   "':'...','" + this.appConfigService.config.refreshTokenObjectKey + "':'...value...'}` response after login.");

            this.authStatusSource.next(false);
            return false;
          }

          this.tokenStoreService.storeLoginSession(response);
          this.refreshTokenService.scheduleRefreshToken(true);
          this.authStatusSource.next(true);
          return true;
        }),
      );
  }


  verify(credentials: VerifyDto): Observable<boolean> {
    return this .post(credentials, UrlHelper.Verify);     
  }

  verifyCode(userName: string): Observable<boolean> {
    return this.post(null, `${UrlHelper.VerifyCode}?userName=${userName}`);     
  }


  register(model: RegisterDto): Observable<boolean> {

    return this
      .post(model, UrlHelper.Register)
      .pipe(
        // map((response: boolean) => {
        //   // this.tokenStoreService.setRememberMe(credentials.rememberMe);
        //   // if (!response) {

        //   //   // console.error("There is no `{'" + this.appConfigService.config.accessTokenObjectKey +
        //   //   //   "':'...','" + this.appConfigService.config.refreshTokenObjectKey + "':'...value...'}` response after login.");

        //   //   this.authStatusSource.next(false);
        //   //   return false;
        //   // }


          
        //   this.tokenStoreService.storeLoginSession(response);
        //   console.log("Logged-in user info", this.getAuthUser());
        //   this.refreshTokenService.scheduleRefreshToken(true);
        //   this.authStatusSource.next(true);
        //   return true;

        // }),
        catchError(this.baseHttpService.handleError)
      );
  }





  getBearerAuthHeader(): HttpHeaders {
    return new HttpHeaders({
      "Content-Type": "application/json",
      "Authorization": `Bearer ${this.tokenStoreService.getRawAuthToken(AuthTokenType.AccessToken)}`
    });
  }

  logout(navigateToHome: boolean): void {

    const refreshToken = encodeURIComponent(this.tokenStoreService.getRawAuthToken(AuthTokenType.RefreshToken));
    this.get(UrlHelper.Logout + `?refreshToken=${refreshToken}`)
      .pipe(
        map(response => response || {}),
        catchError(this.baseHttpService.handleError),
        finalize(() => {
          this.tokenStoreService.deleteAuthTokens();
          this.refreshTokenService.unscheduleRefreshToken(true);
          this.authStatusSource.next(false);
          if (navigateToHome) {
            this.router.navigate(["/"]);
          }
        }))
      .subscribe(result => {
        console.log("logout", result);
      });
  }

  isAuthUserLoggedIn(): boolean {
    return this.tokenStoreService.hasStoredAccessAndRefreshTokens() &&
      !this.tokenStoreService.isAccessTokenTokenExpired();
  }

  getAuthUser(): AuthUserModel | null {
    if (!this.isAuthUserLoggedIn()) {
      return null;
    }

    const decodedToken = this.tokenStoreService.getDecodedAccessToken();
    const roles = this.tokenStoreService.getDecodedTokenRoles();
    return Object.freeze({
      userId: decodedToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"],
      userName: decodedToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"],
      displayName: decodedToken["DisplayName"],
      roles: roles
    });
  }

  isAuthUserInRoles(requiredRoles: string[]): boolean {
    const user = this.getAuthUser();
    if (!user || !user.roles) {
      return false;
    }

    if (user.roles.indexOf(this.configService.config.adminRoleName.toLowerCase()) >= 0) {
      return true; // The `Admin` role has full access to every pages.
    }

    return requiredRoles.some(requiredRole => {
      if (user.roles) {
        return user.roles.indexOf(requiredRole.toLowerCase()) >= 0;
      } else {
        return false;
      }
    });
  }

  isAuthUserInRole(requiredRole: string): boolean {
    return this.isAuthUserInRoles([requiredRole]);
  }

  private updateStatusOnPageRefresh(): void {
    this.authStatusSource.next(this.isAuthUserLoggedIn());
  }
}