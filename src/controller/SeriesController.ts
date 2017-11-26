import {Controller, Param, Body, Get, Post, Put, Delete} from "routing-controllers";
import { Series } from "../entity/Series";

@Controller()
export class SeriesController {

    @Get("/series")
    getAll(): Promise<Series[]> {
        //return "This action returns all users";
        return Series.find();
    }

    @Get("/series/:id")
    getOne(@Param("id") id: string): Promise<Series> {
        return Series.findOneById(id);
    }

    @Post("/series")
    post(@Body() user: any) {
        return "Saving user...";
    }

    @Put("/series/:id")
    put(@Param("id") id: string, @Body() user: any) {
        return "Updating a user...";
    }

    @Delete("/series/:id")
    remove(@Param("id") id: string) {
        return "Removing user...";
    }

}