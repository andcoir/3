
export class TreeModel {
    value: string;
    id: any;
    parentId?: any;
    children: TreeModel[];
    hasChildren: boolean;
    isActive : boolean=true;
    level: number;
}

