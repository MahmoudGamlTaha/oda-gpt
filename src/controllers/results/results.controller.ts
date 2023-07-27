import { ResultService } from "src/services/result/result.service";
import { BaseController } from "../base.controller";
import { Controller, Get, Injectable, Param, UseGuards } from "@nestjs/common";
import { AuthGuard } from "src/services/auth/auth.guard";

@Controller("gen-products")
export class ResultController extends BaseController<ResultService>{
    constructor(private readonly resultService:ResultService){
        super(resultService);
    }
     @UseGuards(AuthGuard)
     @Get('gen-by-user')
     findCurrentUserGenDesign(){
        return this.resultService.findCurrentUserGenDesign();
    }

}