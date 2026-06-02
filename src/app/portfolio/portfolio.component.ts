import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { HeroComponent } from './hero/hero.component';
import { PopularExperiencesComponent } from './popular-experiences/popular-experiences.component';
import { AvailableTodayInParisComponent } from './available-today-in-paris/available-today-in-paris.component';
import { ExploreByMoodComponent } from "./explore-by-mood/explore-by-mood.component";
import { GuidesByLanguageComponent } from './guides-by-language/guides-by-language.component';
import { ParisEscapeOriginalsComponent } from './paris-escape-originals/paris-escape-originals.component';
import { ExperienceParisComponent } from './experience-paris/experience-paris.component';
import { HowItWorksComponent } from './how-it-works/how-it-works.component';
import { TravelersTestimonialsComponent } from './travelers-testimonials/travelers-testimonials.component';
import { NewsletterComponent } from './newsletter/newsletter.component';
import { FooterComponent } from './footer/footer.component';

@Component({
  selector: 'app-portfolio',
  standalone: true,
  imports: [
    CommonModule, 
    HeaderComponent, 
    HeroComponent, 
    PopularExperiencesComponent, 
    AvailableTodayInParisComponent, 
    ExploreByMoodComponent, 
    GuidesByLanguageComponent,
    ParisEscapeOriginalsComponent,
    ExperienceParisComponent,
    HowItWorksComponent,
    TravelersTestimonialsComponent,
    NewsletterComponent,
    FooterComponent
  ],
  templateUrl: './portfolio.component.html',
  styleUrl: './portfolio.component.scss'
})
export class PortfolioComponent {

}
