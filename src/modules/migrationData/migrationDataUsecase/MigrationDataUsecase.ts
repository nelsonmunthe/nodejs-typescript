import { Request, } from "express";
import GenericResponseEntity from "../../../entities/GenericResponseEntity";
import fs from "fs";
import * as xlsx from 'xlsx';
import path from "path";
import axios from "axios";
import FormData from "form-data";

class MigrationDataUsecase {
    constructor(){

    }

    convertToJSON (filePath: string)  {
        // Read the workbook from the file
        const workbook = xlsx.readFile(filePath);

        // Get the first sheet
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];

        // Convert the sheet to JSON
        const jsonData = xlsx.utils.sheet_to_json(sheet, { header: 'A' });

        return jsonData;
    };

    bufferFile(relPath: string) {
        return fs.readFileSync(path.join(__dirname, relPath), { encoding: 'utf8' })
    }

    async customerVerification(req: Request){
        const response = new GenericResponseEntity();
        try {
            if(!req.file) {
                return response.errorResponse('File is required.', 404, null);
            }
  
            const data = this.convertToJSON(path.join(__dirname, '../../../assets/') + req.file?.filename);
        
            let cacheData:any = {};

            if(fs.existsSync(path.join(__dirname, '../../../data/') + process.env.env + "-" + process.env.companyName + '.json')){
                cacheData = this.bufferFile('../../../data/' + process.env.env + "-" + process.env.companyName + '.json')
            }
            
            for(let item of data) {
                let data:any = item;
                if(data["A"] === "company_name") continue;

                let detail:any = {}
                detail["company_name"]   = data["A"];
                detail["Customer OMS ID"]   = data["B"];
                detail["Admin_Email"]   = data["C"];
                detail["OMS Document Name"]   = data["D"];
                detail["document_name"]   = data["E"];
                detail["uploaded_file"]   = data["F"];
                detail["expired_date"]   = data["G"];
                detail["status"]   = "In Review";
                detail["customer_verified_id"]   = ""
                detail["file_url"] = "";
                detail["remarks"]   = "";
                // console.log("detail", cacheData)
                if(detail["company_name"] in cacheData) {
                    detail["customer_verified_id"] = cacheData[detail["company_name"]].customer_verified_id
                    cacheData[detail["company_name"]].data.push(detail)
                } else {

                    const memoHeaders = {
                        'Authorization': `token ${process.env.api_key}:${process.env.api_secret}`
                    }

                    if(data["B"] && data["D"] && (data["B"] !== "" || data["B"] !== "#N/A")) {
                        const response =  await axios
                            .post(process.env.MOF_SERVICES + `/api/resource/Customer%20Verification`,
                                {
                                    "customer_id": data["B"],
                                    "purpose": "New Customer"
                                },
                                {headers: memoHeaders}
                            )
                        if(response.data?.data?.name) {
                            detail["customer_verified_id"] = response.data?.data?.name
                        }
                    }

                    const newData = {
                        data: [detail],
                        remarks: "",
                        customer_verified_id: detail["customer_verified_id"] ?? "",
                        status: "In Review"
                    }

                    cacheData[detail["company_name"]] = newData
                }


            }
            
            fs.writeFile(path.join(__dirname, '../../../data/') + process.env.env + "-" + process.env.companyName + '.json', JSON.stringify(cacheData), (err) => {
                if (err) {
                    return response.errorResponse(err.message, 500, null);
                }
            });

            return response.successResponse('Upload succeeded', 200, cacheData)

        } catch (error:any) {
            return response.errorResponse(error.message, 404, null)
        }
    }

    async uploadDocument(req: Request) {
        const response = new GenericResponseEntity();
        try {
            let cacheData:any = {};
            let content  = fs.readFileSync(path.join(__dirname, '../../../data/') + process.env.env + "-" + process.env.companyName + '.json', 'utf8');
            content = JSON.parse(content)

            for(let [key, values] of Object.entries(content)) {
                const items:any = values;
                const { data }   = items
                for(let index=0; index < data.length; index++) {
                    const detail = data[index];
                    
                    if(detail.customer_verified_id !== "" && detail.file_url === "") {
                        let buffer = fs.createReadStream(path.join(__dirname, '../../../../../../../' + detail.uploaded_file))
                        if(buffer) {
                            const form = new FormData();
                            const filename = detail.uploaded_file.split('/').pop();
                            form.append('file', buffer, {
                                filename: filename,
                                contentType: 'image/jpeg' // Optional, but recommended for proper MIME type handling
                            });

                            const memoHeaders = {
                                'Authorization': `token ${process.env.api_key}:${process.env.api_secret}`
                            }

                            try {
                                const response =  await axios
                                .post(process.env.MOF_SERVICES + `/api/method/upload_file`,
                                    form,
                                    {headers: memoHeaders}
                                )
    
                                if(response?.data?.message?.file_url) {
                                    detail.file_url = response.data.message.file_url
                                } 
                            } catch (error:any) {

                                detail['remarks'] = error.response.data.exception
                            }
                            
                            if(cacheData[key]) {
                                cacheData[key].data.push(detail)
                            } else {
                                const newData = {
                                    ...items,
                                    data: [detail]
                                }
                                cacheData[key] = newData
                            }
                        }
                        
                    } else {
                        if(cacheData[key]) {
                            cacheData[key].data.push(detail)
                        } else {
                            const newData = {
                                ...items,
                                data: [detail]
                            }
                            cacheData[key] = newData
                        }
                    }
                    console.log("cacheData", detail)
                }
            }
            
            // console.log("content", content)
            // fs.readFile(path.join(__dirname, '../../../data/') + process.env.env + "-" + process.env.companyName + '.json', {encoding: 'utf-8'}, function(err, response){
            //     if (!err) {
            //         const data = JSON.parse(response);
                   
            //         for(let [key, values] of Object.entries(data)) {
            //             const items:any = values;
            //             for(let index=0; index < items.length; index++) {
            //                 const detail = items[index];
                            
            //                 if(detail.customer_verified_id !== "" && detail.file_url === "") {
            //                     fs.readFile(path.join(__dirname, '../../../../../../../' + detail.uploaded_file), 'utf8', async (err, data) => {
            //                         if (err) {
            //                             console.error('Error reading file:', err);
            //                             return;
            //                         }
            //                         const form = new FormData();
            //                         const filename = detail.uploaded_file.split('/').pop();
            //                         form.append('file', data, {
            //                             filename: filename,
            //                             contentType: 'image/jpeg' // Optional, but recommended for proper MIME type handling
            //                         });
                                    
            //                         const memoHeaders = {
            //                             'Authorization': `token ${process.env.api_key}:${process.env.api_secret}`
            //                         }

            //                         const response =  await axios
            //                         .post(process.env.MOF_SERVICES + `/api/method/upload_file`,
            //                             form,
            //                             {headers: memoHeaders}
            //                         )

            //                         if(response?.data?.message?.file_url) {
            //                             detail.file_url = response.data.message.file_url
            //                         } 
                                    
            //                         if(cacheData[key]) {
            //                             cacheData[key].push(detail)
            //                         } else {
            //                             cacheData[key] = [detail]
            //                         }
            //                         // console.log("cacheData", cacheData)
            //                     });
                                
            //                 } else {
            //                     if(cacheData[key]) {
            //                         cacheData[key].push(detail)
            //                     } else {
            //                         cacheData[key] = [detail]
            //                     }
            //                 }
            //             }
            //         }
            //     }

            //     console.log('output',cacheData)
            // });
            fs.writeFile(path.join(__dirname, '../../../data/') + process.env.env + "-" + process.env.companyName + '.json', JSON.stringify(cacheData), (err) => {
                if (err) {
                    return response.errorResponse(err.message, 500, null);
                }
            });

            return response.successResponse('Upload succeeded', 200, null)
        } catch (error:any) {

            return response.errorResponse(error.message, 404, null)
        }
    }

    async customerVerificationDocument(req: Request){
        const response = new GenericResponseEntity();
        try {
            let cacheData:any = {};
            let content  = fs.readFileSync(path.join(__dirname, '../../../data/') + process.env.env + "-" + process.env.companyName + '.json', 'utf8');
            content = JSON.parse(content)
            
            for(let [key, values] of Object.entries(content)) {
                const items:any = values;
                    
                if(items.customer_verified_id !== "" && items.data[0].file_url !== "") {
                    const memoHeaders = {
                        'Authorization': `token ${process.env.api_key}:${process.env.api_secret}`
                    }
                    const registration_documents = items.data.map((item:any) => {
                        return{
                            "master_registration_document_id": item["OMS Document Name"], //required
                            "file_document": item.file_url,  //Perlu upload image atau document dulu untuk dapatkan file_url ini
                            "expired_date": "2025-12-31",
                            "status": "In Review"
                        }
                    })

                    try {
                        const response =  await axios
                        .put(process.env.MOF_SERVICES + `/api/resource/Customer%20Verification/${items.customer_verified_id}`,
                            {
                                registration_documents: registration_documents
                            },
                            {headers: memoHeaders}
                        )

                        if(response) {
                            items.status = "In Review"
                        }

                    } catch (error:any) {

                        items.remarks = error.response.data.exception;
                    }
                                        
                } 

                cacheData[key] = items
            }

            fs.writeFile(path.join(__dirname, '../../../data/') + process.env.env + "-" + process.env.companyName + '.json', JSON.stringify(cacheData), (err) => {
                if (err) {
                    return response.errorResponse(err.message, 500, null);
                }
            });

            return response.successResponse('Verification document succeeded', 200, null)
        } catch (error:any) {
            
            return response.errorResponse(error.message, 404, null)
        }
    }

    async customerVerificationStatus(req: Request){
        const response = new GenericResponseEntity();
        try {
            let cacheData:any = {};
            let content  = fs.readFileSync(path.join(__dirname, '../../../data/') + process.env.env + "-" + process.env.companyName + '.json', 'utf8');
            content = JSON.parse(content)
            
            for(let [key, values] of Object.entries(content)) {
                const items:any = values;
                    
                if(items.status === "In Review") {
                    const memoHeaders = {
                        'Authorization': `token ${process.env.api_key}:${process.env.api_secret}`
                    }
                    const registration_documents = items.data.map((item:any) => {
                        return{
                            "master_registration_document_id": item["OMS Document Name"], //required
                            "file_document": item.file_url,  //Perlu upload image atau document dulu untuk dapatkan file_url ini
                            "expired_date": "2025-12-31",
                            "status": "In Review"
                        }
                    })

                    try {
                        const response =  await axios
                        .put(process.env.MOF_SERVICES + `/api/resource/Customer%20Verification/${items.customer_verified_id}`,
                            {
                                registration_documents: registration_documents
                            },
                            {headers: memoHeaders}
                        )

                        if(response) {
                            items.status = "Incomplete"
                        }

                    } catch (error:any) {
                        items.remarks = error.response.data.exception;
                        console.log("error", error.response.data.exception)
                    }
                                        
                } 

                cacheData[key] = items
            }

            fs.writeFile(path.join(__dirname, '../../../data/') + process.env.env + "-" + process.env.companyName + '.json', JSON.stringify(cacheData), (err) => {
                if (err) {
                    return response.errorResponse(err.message, 500, null);
                }
            });

            return response.successResponse('Verification status succeeded', 200, null)
        } catch (error:any) {
            return response.errorResponse(error.message, 404, null)
        }
    }
}

export default MigrationDataUsecase;