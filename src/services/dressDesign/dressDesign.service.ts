import { UserPrompt } from "src/model/userPrompt.entity";
import { BaseService } from "../base.service";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { HttpException, Inject, Injectable } from "@nestjs/common";
import { HttpService } from '@nestjs/axios'
import { DesignFilter } from "src/model/dto/designFilter.dto";
import Replicate from "replicate";
import { StatusCode, StabilityKey, sleep, ResultType, replicateKey } from "src/constant/constant";
import { UploaderService } from "../uploader/uploader.service";
import { ImageUploader } from "src/model/uploader.entity";
import { Result } from "src/model/result.entity";
import { ResultService } from "../result/result.service";
import { version } from "os";
import { PromptGuidService } from "../promptGuide/promptGuid.service";
import { PromptGuide } from "src/model/PromptGuide.entity";
import { UserService } from "../users/user.service";
import { UserDto } from "src/model/dto/user.dto";
const axios = require('axios').default;
const fs = require("fs");
//https://www.greataiprompts.com/imageprompt/stable-diffusion-anime-prompts/
@Injectable()
export class DressDesignService extends BaseService<UserPrompt, Repository<UserPrompt>> {
    private  token:string;
    private http:HttpService;
    @InjectRepository(ImageUploader)
    private imageUploaderRepository:Repository<ImageUploader>;
    
     @Inject(ResultService)
     private resultService:ResultService;
     @Inject(UploaderService)
     private uploader:UploaderService;
     @Inject(PromptGuidService)
     private promptGuidService:PromptGuidService
     @Inject(UserService)
     private userService:UserService;
     
     constructor(@InjectRepository(UserPrompt) private readonly userPrompt:Repository<UserPrompt>){
        super(userPrompt);
        this.token = replicateKey.DressDesignKey;
       
    }
    public async uploadDressImage(file: Express.Multer.File){
      return this.uploader.uploadFile(file);
    }

    public async getAIDesignDressReplicateV2(designFilter:DesignFilter){
      var errMsg:string = null 
      try {
         
        let promptGuid:String = await this.promptGuidService.findByTags(designFilter.tag);
         if(promptGuid == ""){
            promptGuid = designFilter.prompt;
         }else{
           designFilter.prompt = promptGuid;
         }
         if(promptGuid == ""){
          errMsg = "prompt required";
          throw  new Error(errMsg);
         }
         let user = (await this.getCurrentUser());
        let userPrompt = new UserPrompt();
        userPrompt.prompt = promptGuid;
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

      
      
     //  return [
 //       "https://pbxt.replicate.delivery/M0QjygdSqbbeUCHc1Uc7E8N0gsFbUpFGbmS3AwKBYBY77OqIA/out-0.png"
    //];
        const response = await axios.post(
          replicateKey.baseReplicateUrI,
          {
            version:
              replicateKey.DressDesignAPI_V2,
            input: {
              scheduler: "K_EULER_ANCESTRAL",
              prompt: designFilter.prompt,
              scale: 9,
              a_prompt:"best quality, photo from Pinterest, interior, cinematic photo, ultra-detailed, ultra-realistic, award-winning, interior design, natural lighting",
              n_prompt:"longbody, lowres, bad anatomy, bad hands, missing fingers, extra digit, fewer digits, cropped, worst quality, low quality",
              negative_prompt:"longbody, lowres, bad anatomy, bad hands, missing fingers, extra digit, fewer digits, cropped, worst quality, low quality"
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
        imageuploader.userId = (await this.userSessionService.getCurrentUser()).id;
        this.imageUploaderRepository.save(imageuploader);
        let status = "starting";
        let responseData = null; 
        let getUrl = response.data.urls.get;
        console.log(response.data.urls);
        sleep(2000);
        do{
        sleep(2000);
        console.log(status);
        //check status return from get //"status": "succeeded"
        let result = await axios.get(getUrl,{
          headers:{
            "Content-Type": "application/json",
            "Authorization": this.token,
          }
        });
         
        responseData = JSON.parse(JSON.stringify(result.data));
        status = responseData.status;
      }while(status != "succeeded" && status !="fail" );
       //  console.log(this.uploadDressImage(response.output));
         let results = Array();
         let paths = Array();
         let uid = (await this.userSessionService.getCurrentUser()).id;
         var max = await this.resultService.getMaxId(); 
          responseData.output.forEach( (url) => {
         //const fileWriter = fs.createWriteStream( `./generatedImages/replicate/dresses/v1_txt2img_${index}.png`); 
         let imagePath = `./generatedImages/replicate/dresses/dress_txt2img_${uid}_${max}.png`
              let result = new Result();
              result.lastUpdatedDate = new Date();
              result.promptId = userPrompt.id;
              result.userId = uid 
              result.result = imagePath;
              result.resultType = ResultType.IMAGE_URL
              results.push(result);
              max++;
              paths.push([imagePath, url]);
        });
       
       for  (let i = 0; i< paths.length; i++){
           let sucess = this.downloadImage(paths[i][1], paths[i][0]);
           console.log(sucess);
        }
        console.log("save result");
        console.log(results);
       this.resultService.saveAll(results);
        user.credit = user.credit - 1;
        let userDto = new UserDto();
        userDto.credit = user.credit;
        user.lastUpdatedDate = new Date();
        this.userService.updateById(user.id, userDto);
        return responseData==null?{status:StatusCode.FAIL, message:"fail"}: responseData.output;
      } catch (error) {
        console.log("\n getAIDesignDressReplicateV2 rexception \n");
        console.error(error);
        return {
          status:StatusCode.FAIL,
          message:errMsg==null?error:errMsg
        }
      }
}


private async downloadImage(url, filename) {
  try {
    const response = await axios.get(url, {
      responseType: 'arraybuffer'
    });

    await new Promise((resolve, reject) => {
      fs.writeFile(filename, response.data, (err) => {
        if (err) reject(err);
        console.log('Image downloaded successfully!');
        
      });
    });

    return 1;
  } catch (err) {
    console.error(err);
    return 0;
  }
}
/*private async downloadImage(url, filename) {
  const response = await axios.get(url, { responseType: 'arraybuffer' });

  fs.writeFile(filename, response.data, (err) => {
    if (err) throw err;
    console.log('Image downloaded successfully!');
    return;
  });
  return 1;
}*/

    public async getAIDressV2(designFilter:DesignFilter){

      try {
        var userId = (await this.getCurrentUser()).id;
        let userPrompt = new UserPrompt();
        userPrompt.prompt = designFilter.prompt
        userPrompt.lastUpdatedDate = new Date();
        userPrompt.userId = userId;
        this.save(userPrompt).then((val)=>{
           userPrompt.id = val.id ;
        });
        console.log(userPrompt);

       
        const response = await axios.post(
          StabilityKey.baseStabilityURL+"/v1/generation/"+StabilityKey.engine+"/text-to-image",
          {
            
            "cfg_scale": 7,
            "clip_guidance_preset": "FAST_BLUE",
            "height": 512,
            "width": 512,
            "seed":1229080980,
            "sampler": "K_DPM_2_ANCESTRAL",
            "samples": 1,
            "steps": 75,
            "style_preset":"cinematic",
            "text_prompts": [
              {
                "text": designFilter.prompt,
                "weight": 1
              }
            ]
          }
         ,
          {
            headers: {
              "Content-Type": "application/json",
              "Accept": 'application/json',
              "Authorization": this.token, // shuod be chnage to stabilty token
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
        imageuploader.userId = userId;
        this.imageUploaderRepository.save(imageuploader);
     
        let responseData = null; 
       
 /*       interface GenerationResponse {
          artifacts: Array<{
            base64: string
            seed: number
            finishReason: string
          }>
        }*/
         responseData = JSON.parse(JSON.stringify(response.data));
        var results = new Array();
         responseData.artifacts.forEach((image, index) => {
          fs.writeFileSync(
            `./generatedImages/stability/dresses/v1_txt2img_${index}.png`,
            Buffer.from(image.base64, 'base64')
          )
          let result = new Result();
          result.lastUpdatedDate = new Date();
          result.promptId = userPrompt.id;
          result.userId = userId;
          result.result = `/generatedImages/stability/dresses/v1_txt2img_${index}.png`;
          result.resultType = ResultType.IMAGE_URL
          results.push(result);
        
        })
        this.resultService.saveAll(results);
      
        return responseData==null?{status:StatusCode.FAIL, message:"fail"}: responseData.output;
      } catch (error) {
        console.log("\n getAI Dress rexception \n");
        console.error(error);
      }
    }
    

   
  

}