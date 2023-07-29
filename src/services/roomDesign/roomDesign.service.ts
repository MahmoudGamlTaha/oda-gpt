import { UserPrompt } from "src/model/userPrompt.entity";
import { BaseService } from "../base.service";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { HttpException, Inject, Injectable, UseGuards } from "@nestjs/common";
import { HttpService } from '@nestjs/axios'
import { DesignFilter } from "src/model/dto/designFilter.dto";
import Replicate from "replicate";
import { StatusCode, replicateKey, sleep } from "src/constant/constant";
import { UploaderService } from "../uploader/uploader.service";
import { ImageUploader } from "src/model/uploader.entity";
import { AuthGuard } from "../auth/auth.guard";
import { UserDto } from "src/model/dto/user.dto";
const axios = require('axios').default;
@UseGuards(AuthGuard)
@Injectable()
export class RoomDesignService extends BaseService<UserPrompt, Repository<UserPrompt>> {
    private  token:string;
    private http:HttpService;
    @InjectRepository(ImageUploader)
    private imageUploaderRepository:Repository<ImageUploader>;
   //  private  replicate:Replicate;
     @Inject(UploaderService)
     private uploader:UploaderService;
    constructor(@InjectRepository(UserPrompt) private readonly userPrompt:Repository<UserPrompt>){
        super(userPrompt);
        this.token = replicateKey.roomDesignKey;
       
    }
    public async uploadRoomImage(file: Express.Multer.File){
      return this.uploader.uploadFile(file);
    } 
    public  setRelation(){
      this.relations = ["desginType"];
    }
    public async getAIDesignRoomV2(designFilter:DesignFilter){
      var errMsg:string = null 
      try {
         let user = (await this.getCurrentUser());
        let userPrompt = new UserPrompt();
        userPrompt.prompt = designFilter.prompt
        userPrompt.lastUpdatedDate = new Date();
        userPrompt.userId = user.id;
        this.save(userPrompt).then((val)=>{
           userPrompt.id = val.id ;
        });
        console.log(userPrompt);
        
        if(user.credit <= 0){
          errMsg = 'not enough credit';
          throw new HttpException(errMsg, StatusCode.ValidationError);

        }

        const response = await axios.post(
          replicateKey.baseReplicateUrI,
          {
            version:
              replicateKey.roomDesignAPI_V2,
            input: {
              image: designFilter.filePath,
              prompt: designFilter.prompt,
              scale: 9,
              a_prompt:
                "best quality, photo from Pinterest, interior, cinematic photo, ultra-detailed, ultra-realistic, award-winning, interior design, natural lighting",
              n_prompt:
                "longbody, lowres, bad anatomy, bad hands, missing fingers, extra digit, fewer digits, cropped, worst quality, low quality",
            },
          },
          {
            headers: {
              "Content-Type": "application/json",
              "Authorization": this.token,
            },
          }
        );
        //console.log("\n****************************\n");
        //console.log(response);

        let imageuploader = new ImageUploader();
        imageuploader.imageUrl = designFilter.filePath;
        imageuploader.designTypeId = designFilter.typeId;
        imageuploader.lastUpdatedDate = new Date();
        imageuploader.promptId = userPrompt.id;
        imageuploader.userId = 1;
        this.imageUploaderRepository.save(imageuploader);
        let status = "starting";
        let responseData = null; 
        let getUrl = response.data.urls.get;
        console.log(response.data.urls);
        sleep(1000);
        do{
        sleep(2500);
        console.log(getUrl);
        //check status return from get //"status": "succeeded"
        let result = await axios.get(getUrl,{
          headers:{
           "Content-Type": "application/json",
            "Authorization": this.token,
          }
        });
         
        responseData = JSON.parse(JSON.stringify(result.data));
        status = responseData.status;
        
      }while(status != "succeeded");
         console.log(this.uploadRoomImage(response.output[1]));
         let userDto = new UserDto();
         userDto.credit = user.credit;
         user.lastUpdatedDate = new Date();
         this.userService.updateById(user.id, userDto);
        return responseData==null?{status:StatusCode.FAIL, message:"fail"}: responseData.output;
      } catch (error) {
        console.log("\n getAIDesignRoomV2 rexception \n");
        console.error(error);
      }

    

/*      let startResponse = await this.http.post(
        "https://api.replicate.com/v1/predictions",
        {
        
          body: JSON.stringify({
            version:
              "854e8727697a057c525cdb45ab037f64ecca770a1769cc52287c2e56472a247b",
            input: {
              image: designFilter.filePath,
              prompt: designFilter.prompt,
              scale: 9,
              a_prompt:
                "best quality, photo from Pinterest, interior, cinematic photo, ultra-detailed, ultra-realistic, award-winning, interior design, natural lighting",
              n_prompt:
                "longbody, lowres, bad anatomy, bad hands, missing fingers, extra digit, fewer digits, cropped, worst quality, low quality",
            },
          }),
          headers: {
            "Content-Type": "application/json",
            Authorization: "Token " + this.token,
          }
        }
      );
  
      let jsonStartResponse = await startResponse.toPromise();
console.log(jsonStartResponse.data);
      
  
     /* console.log(this.token);
      const replicate = new Replicate({
        auth: this.token
    });
    
        const output = replicate.run(
          'usamaehsan/controlnet-1.1-x-realistic-vision-v2.0:542a2f6729906f610b5a0656b4061b6f792f3044f1b86eca7ce7dee3258f025b',
        {
            input:{
                prompt: designFilter.prompt,
                image: designFilter.filePath,
                a_prompt:replicateKey.roomDesignAPI_V2_a_Prompt,
                n_prompt:replicateKey.roomDesignAPI_V2_N_Prompt
            }
        }
      ); 
    return output;*/
    }

}