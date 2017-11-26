import { Index, Entity, PrimaryColumn, Column, OneToOne, OneToMany, ManyToOne, JoinColumn, BaseEntity } from "typeorm";


@Entity()
export class OauthClients extends BaseEntity{

    @Column("text",{ nullable:false, primary:true })
    client_id:string;
        

    @Column("text",{ nullable:false})
    client_secret:string;
        

    @Column("text",{ nullable:false })
    redirect_uri:string;

}