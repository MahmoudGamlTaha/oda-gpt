
export const jwtConstants = {
  secret: 'eyJhbGciOiJIUzI1NiJ9.eyJSb2xlIjoiQWRtaW4iLCJJc3N1ZXIiOiJJc3N1ZXIiLCJVc2VybmFtZSI6IkphdmFJblVzZSIsImV4cCI6MTY4ODMxNTAyNywiaWF0IjoxNjg4MzE1MDI3fQ.4MdXgjc6ql7SfPwK8m-vGTByKnEexxz-TOurOK8jkgg',
};

export const StatusCode ={
  SUCCESS:0,
  FAIL:500,
  ValidationError:400

}
export const CLOUDINARY = 'Cloudinary';
export const saltRounds = 14;
//usamaehsan/controlnet-1.1-x-realistic-vision-v2.0: for room design
//542a2f6729906f610b5a0656b4061b6f792f3044f1b86eca7ce7dee3258f025b

//-- stable diffusion 
//db21e45d3f7023abc2a46ee38a23973f6dce16bb082a930b0c49861f96d1e5bf

// current used controlnet-hough
export const replicateKey ={
   roomDesignKey:'Token r8_TaikyyTn3i1GuhySOE3jE0ocTKmUrOA38lGsf',
   baseReplicateUrI: 'https://api.replicate.com/v1/predictions',
   roomDesignAPI_V2:'854e8727697a057c525cdb45ab037f64ecca770a1769cc52287c2e56472a247b',
   roomDesignAPI_V2_a_Prompt:"best quality, photo from Pinterest, interior, cinematic photo, ultra-detailed, ultra-realistic, award-winning, interior design, natural lighting",
   roomDesignAPI_V2_N_Prompt:"longbody, lowres, bad anatomy, bad hands, missing fingers, extra digit, fewer digits, cropped, worst quality, low quality",
   DressDesignKey:'Token r8_TaikyyTn3i1GuhySOE3jE0ocTKmUrOA38lGsf',
   DressDesignAPI_V2:'ac732df83cea7fff18b8472768c88ad041fa750ff7682a21affe81863cbe77e4'
  }

export const StabilityKey = {
      dressDesignKey:'Bearer sk-8mdUSv7HrXRJRA3lMDho8EyJvE6gV3RQgdFzl88NbCJdwJeJ',
      baseStabilityURL:'https://api.stability.ai',
      engine:'stable-diffusion-512-v2-1'
}
export const ResultType = {
 IMAGE_URL :"IMAGE_URL"
}
export const sleep = (ms:number) => new Promise(r => setTimeout(r, ms));


