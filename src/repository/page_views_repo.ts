import { getManager } from "typeorm";
import { PageView } from "../entities/ud_page_views";

export class PageViewsRepo {
 
    getAllPageViews() {
        // get Employee repository and find all employees
        return getManager().getRepository(PageView).find();
    }
 
    savePageViews(page_view: PageView) { 
          return getManager().getRepository(PageView).save(page_view);
    }
 
}