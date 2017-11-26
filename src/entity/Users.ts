import {
    Entity, Column, PrimaryGeneratedColumn, BaseEntity, PrimaryColumn, ManyToMany, JoinTable,
    OneToMany
} from "typeorm";
import { Series } from "./Series";
import { OauthAuthorizationCodes } from "./OauthAuthorizationCodes";

@Entity()
export class Users extends BaseEntity{

    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    username: string;

    @Column()
    password: string;

    @OneToMany(type => Series, series => series.user)
    series: Series[];

    @OneToMany(type => OauthAuthorizationCodes, oauthAuthorizationCodes => oauthAuthorizationCodes.user)
    oauth_authorization_codes: OauthAuthorizationCodes[];
}