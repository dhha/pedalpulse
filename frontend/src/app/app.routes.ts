import { Routes } from "@angular/router";
import { HomeComponent } from "./home/home.component";
import { ErrorPageComponent } from "./error-page/error-page.component";
import { JourneysComponent } from "./journeys/journeys.component";

export const AppRoutes =  [
    {
        path: "",
        component: HomeComponent
    },
    {
        path: "journeys",
        component: JourneysComponent
    },
    {
        path: "**",
        component: ErrorPageComponent
    }
]
