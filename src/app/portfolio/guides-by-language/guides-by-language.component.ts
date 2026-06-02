import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardPersonComponent, Guide } from '../component/card-person/card-person.component';

@Component({
  selector: 'app-guides-by-language',
  standalone: true,
  imports: [CommonModule, CardPersonComponent],
  templateUrl: './guides-by-language.component.html',
  styleUrl: './guides-by-language.component.scss'
})
export class GuidesByLanguageComponent {
  languages = ['English', 'French', 'Spanish', 'Arabic'];
  selectedLanguage = 'English';

  guides: Guide[] = [
    {
      id: 1,
      name: 'Sophie Martin',
      specialty: 'Art History Expert',
      rating: 4.9,
      photo: '/assets/images/avatar/sophie.png',
      languages: ['English', 'French']
    },
    {
      id: 2,
      name: 'James Wilson',
      specialty: 'Food & Culture',
      rating: 4.8,
      photo: '/assets/images/avatar/james.png',
      languages: ['English']
    },
    {
      id: 3,
      name: 'Emma Thompson',
      specialty: 'Photography Tours',
      rating: 5.0,
      photo: '/assets/images/avatar/emma.png',
      languages: ['English', 'Spanish']
    },
    {
      id: 4,
      name: 'Michael Chen',
      specialty: 'Hidden Gems',
      rating: 4.9,
      photo: '/assets/images/avatar/michael.png',
      languages: ['English', 'French']
    }
  ];

  get filteredGuides(): Guide[] {
    return this.guides.filter(guide => 
      guide.languages.includes(this.selectedLanguage)
    );
  }

  selectLanguage(language: string): void {
    this.selectedLanguage = language;
  }

  onViewAllGuides(): void {
    console.log('View all guides clicked');
  }
}
