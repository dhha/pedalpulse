import { Routes } from "@angular/router";
import { HomeComponent } from "./home/home.component";
import { ErrorPageComponent } from "./error-page/error-page.component";
import { JourneysComponent } from "./journeys/journeys.component";
import { JourneyFormComponent } from "./journey-form/journey-form.component";
import { JourneyComponent } from "./journey/journey.component";

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
        path: "journeys/create",
        component: JourneyFormComponent
    },
    {
        path: "journey/:journeyId",
        component: JourneyComponent
    },
    {
        path: "journey/:journeyId/edit",
        component: JourneyFormComponent
    },
    {
        path: "**",
        component: ErrorPageComponent
    }
]
