import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { timer ,  Subscription } from "rxjs";
import { catchError, finalize, map } from "rxjs/operators";

import { AuthTokenType } from "./../models/auth-token-type";
import { BaseService } from "./base.service";
import { AppConfigService } from "./app-config.service";
import { TokenStoreService } from "./token-store.service";
import { BrowserStorageService } from "./browser-storage.service";
import { UtilsService } from "./utils.service";
import { UrlHelper } from "../utils/url-helper";


@Injectable()
export class RefreshTokenService extends BaseService{

  private refreshTokenTimerCheckId = "is_refreshToken_timer_started";
  private refreshTokenSubscription: Subscription | null = null;

  constructor(
    private tokenStoreService: TokenStoreService,
    private browserStorageService: BrowserStorageService,
    private utilsService: UtilsService) { 

        super(UrlHelper.Account);
    }

  scheduleRefreshToken(isAuthUserLoggedIn: boolean) {
    this.unscheduleRefreshToken(false);

    if (!isAuthUserLoggedIn) {
      return;
    }

    if (this.isRefreshTokenTimerStartedInAnotherTab()) {
      return;
    }

    const expDateUtc = this.tokenStoreService.getAccessTokenExpirationDateUtc();
    if (!expDateUtc) {
      throw new Error("This access token has not the `exp` property.");
    }
    const expiresAtUtc = expDateUtc.valueOf();
    const nowUtc = new Date().valueOf();
    const initialDelay = Math.max(1, expiresAtUtc - nowUtc);
    console.log("Initial scheduleRefreshToken Delay(ms)", initialDelay);
    const timerSource$ = timer(initialDelay);
    this.refreshTokenSubscription = timerSource$.subscribe(() => {
      this.refreshToken(isAuthUserLoggedIn);
    });

    this.setRefreshTokenTimerStarted();
  }

  unscheduleRefreshToken(cancelTimerCheckToken: boolean) {
    if (this.refreshTokenSubscription) {
      this.refreshTokenSubscription.unsubscribe();
    }

    if (cancelTimerCheckToken) {
      this.deleteRefreshTokenTimerCheckId();
    }
  }

  private refreshToken(isAuthUserLoggedIn: boolean) {
    const headers = new HttpHeaders({ "Content-Type": "application/json" });
    const model = { refreshToken: this.tokenStoreService.getRawAuthToken(AuthTokenType.RefreshToken) };
    
    return this.post(  model,UrlHelper.RefreshToken)
      .pipe(
        map(response => response || {}),
        finalize(() => {
          this.deleteRefreshTokenTimerCheckId();
          this.scheduleRefreshToken(isAuthUserLoggedIn);
        })
      )
      .subscribe(result => {
        console.log("RefreshToken Result", result);
        this.tokenStoreService.storeLoginSession(result);
      });
  }

  private isRefreshTokenTimerStartedInAnotherTab(): boolean {
    if (!this.tokenStoreService.rememberMe()) {
      return false; // It uses the session storage for the tokens and its access scope is limited to the current tab.
    }

    const currentTabId = this.utilsService.getCurrentTabId();
    const timerStat = this.browserStorageService.getLocal(this.refreshTokenTimerCheckId);
    console.log("RefreshTokenTimer Check", {
      refreshTokenTimerCheckId: timerStat,
      currentTabId: currentTabId
    });
    const isStarted = timerStat && timerStat.isStarted === true && timerStat.tabId !== currentTabId;
    if (isStarted) {
      console.log(`RefreshToken timer has already been started in another tab with tabId=${timerStat.tabId}.
      currentTabId=${currentTabId}.`);
    }
    return isStarted;
  }

  private setRefreshTokenTimerStarted(): void {
    this.browserStorageService.setLocal(this.refreshTokenTimerCheckId,
      {
        isStarted: true,
        tabId: this.utilsService.getCurrentTabId()
      });
  }

  private deleteRefreshTokenTimerCheckId() {
    this.browserStorageService.removeLocal(this.refreshTokenTimerCheckId);
  }
}


