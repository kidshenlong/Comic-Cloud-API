import {
    Index, Entity, PrimaryColumn, Column, OneToOne, OneToMany, ManyToOne, JoinColumn, BaseEntity,
    CreateDateColumn, PrimaryGeneratedColumn
} from "typeorm";
import { Users } from "./Users";


@Entity()
export class OauthTokens extends BaseEntity {

    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column("text",{ nullable:false })
    access_token:string;

    @CreateDateColumn({ nullable:false })
    access_token_expires_on:Date;

    @Column("text",{ nullable:false })
    client_id:string;

    @Column("text",{ nullable:false })
    refresh_token:string;

    @CreateDateColumn({ nullable:false })
    refresh_token_expires_on:Date;

    @ManyToOne(type => Users)
    user: Users;
        
}