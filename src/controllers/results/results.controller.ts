import { ResultService } from "src/services/result/result.service";
import { BaseController } from "../base.controller";
import { Controller, Injectable } from "@nestjs/common";

@Controller("gen-products")
export class ResultController extends BaseController<ResultService>{
    constructor(private readonly resultService:ResultService){
        super(resultService);
    }

}