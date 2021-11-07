// this file is managed by migration process, you don't need to touch this.
export interface PhysicalTable {
    'migration': {
        id: number;
        name?: string;
    }
    'user': {
        id: number;
        latitude?: number;
        longitude?: number;
        ip?: number;
        dob?: Date;
        created_at?: Date;
        name: string;
        description?: string;
        address?: string;
    }
    'oauth_github': {
        id: number;
        user_id: number;
        created_at?: Date;
        node_id: string;
    }
}
