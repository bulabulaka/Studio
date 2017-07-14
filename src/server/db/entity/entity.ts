class baseEntity{
    id:number;
    user_id_creator:number;
    user_id_modifier:number;
    created_datetime:Date;
    modified_datetime:Date;
    auditstat:number;
}

export class m_user extends baseEntity{
    username:string;
    password:string;
    salt:string;
    status:number
}
