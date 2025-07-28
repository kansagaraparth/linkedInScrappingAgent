import {embedAndStoreContent } from "../vectorStore/index";
import { ENV_VARS } from "../config/envVars";
import axios from "axios";
  

export async function scrapPage(scrapUrl:string){

    const api_key=ENV_VARS.SCRAPING_DOG_API_KEY;
    const url='https://api.scrapingdog.com/linkedin';
    const content=await extractLinkedInId(scrapUrl);
    const params={
        api_key: api_key,
        type: content.type,
        linkId: content.id,
        premium: 'false',
    }

    try
    {
        const response=await axios.get(url,{params:params})
        if(response.status===200)
        {
            const data=response.data;
            let formatedContent:string;
            if(content.type==="profile")
            {
                formatedContent=await formatProfile(data);
            }
            else
            {
                formatedContent=await formatCompany(data);
            }
            
            embedAndStoreContent(formatedContent,scrapUrl)
        }
        else
        {
            console.log("error fetching data from scrappingdog");
        }
    }
    catch(error)
    {
        console.log("Errr in scrapePofile function ",error);   
    }

}

type JobListing = {
  job_position: string;
  job_link: string;
  job_id: string;
  company_name: string;
  company_profile: string;
  job_location: string;
  job_posting_date: string;
  company_logo_url: string;
};

function formatJobListings(jobs: JobListing[]): string {
  return jobs.map((job, index) => `
        Job #${index + 1}
        Position: ${job.job_position}
        Company: ${job.company_name}
        Location: ${job.job_location}
        Posted on: ${job.job_posting_date}

        Job Link: ${job.job_link}
        Company Profile: ${job.company_profile}
        Logo URL: ${job.company_logo_url}
    `).join("\n------------------------------------\n");
}

export async function scrapSearchResults(job:string,place:string){
    const api_key=ENV_VARS.SCRAPING_DOG_API_KEY;
    const url='https://api.scrapingdog.com/linkedinjobs/';

    const params = {
        api_key: api_key,
        "field": job,
        "geoid": "",
        "location": place,
        "page": 1,
        "sort_by":"" ,
        "job_type":"" ,
        "exp_level":"" ,
        "work_type": "",
        "filter_by_company":"", 
    };

    try
    {
        const response=await axios.get<JobListing[]>(url,{params:params})
        const data=response.data;
        const formatedContent=formatJobListings(data);
        embedAndStoreContent(formatedContent,job +"in "+place);
    }
    catch(error)
    {
      console.log("Errr in scrapePofile function or scrapping dog api ",error);
      throw new Error("Porblme in scraping search results function")   
    }   
}



async function extractLinkedInId(url:string) {

  try {
    const parsedUrl = new URL(url);
    const pathParts = parsedUrl.pathname.split('/').filter(Boolean);

    if (pathParts[0] === 'in' && pathParts.length >= 2) {
      return { type: 'profile', id: pathParts[1] };
    } else if (pathParts[0] === 'company' && pathParts.length >= 2) {
      return { type: 'company', id: pathParts[1] };
    } else {
      return { type: 'unknown', id: null };
    }
  } catch (err) {
    return { type: 'invalid', id: null };
  }
}

async function formatProfile(profile: any): Promise<string> {
    profile=profile[0];
    return `
        Name: ${profile.fullName}
        Headline: ${profile.headline}
        Location: ${profile.location}
        About: ${profile.about || "N/A"}

        Experience:
        ${profile.experience?.map((exp: any) =>
            `- ${exp.position} at ${exp.company_name} (${exp.duration})`
        ).join("\n") || "N/A"}

        Education:
        ${profile.education?.map((edu: any) =>
            `- ${edu.college_name} (${edu.college_duration})`
        ).join("\n") || "N/A"}

        Activities:
        ${profile.activities?.map((a: any) => `- ${a.title}`).join("\n") || "N/A"}
    `.trim();
}

async function formatCompany(company: any): Promise<string> {
    company=company[0];
    return `
        Company Name: ${company.company_name}
        Tagline: ${company.tagline || "N/A"}
        Industry: ${company.industry || "N/A"}
        Location: ${company.location || "N/A"}
        Company Size: ${company.company_size || "N/A"}
        Website: ${company.website || "N/A"}
        Type: ${company.type || "N/A"}
        Headquarters: ${company.headquarters || "N/A"}
        Founded: ${company.founded || "N/A"}
        Followers: ${company.follower_count || "N/A"}
        About: ${company.about || "N/A"}

        Employees:
        ${company.employees?.map((emp: any) =>
        `- ${emp.employee_name}${emp.employee_position ? ` | ${emp.employee_position}` : ""} (${emp.employee_profile_url})`
        ).join("\n") || "N/A"}

        Similar Companies:
        ${company.similar_companies?.map((sim: any) =>
        `- ${sim.name} | ${sim.summary} | ${sim.location}`
        ).join("\n") || "N/A"}

        Location(s):
        ${company.locations?.map((loc: any) =>
        `- ${loc.office_address_line_1}`
        ).join("\n") || "N/A"}
    `.trim();
}


