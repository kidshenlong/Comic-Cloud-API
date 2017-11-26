import {
    Index, Entity, PrimaryColumn, Column, OneToOne, OneToMany, ManyToOne, JoinColumn, BaseEntity,
    CreateDateColumn, PrimaryGeneratedColumn
} from "typeorm";
import { Users } from "./Users";


@Entity()
export class OauthAuthorizationCodes extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column("text",{ nullable:false })
    authorization_code:string;

    @CreateDateColumn({ nullable:false })
    expires:Date;

    @Column("text",{ nullable:false })
    redirect_uri:string;

    @ManyToOne(type => Users)
    user: Users;

}