import { map, tap } from 'rxjs/operators';
import { MainService } from './../../services/main.service';
import { Award } from './../admin/admin.component';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-award',
  templateUrl: './award.component.html',
  styleUrls: ['./award.component.scss'],
})
export class AwardComponent implements OnInit {
  awards: Award[] = new Array();
  constructor(private mainService: MainService, private dialog: MatDialog) {}
  ngOnInit(): void {
    document.querySelector('.containerNav')?.classList.add('sticky');
    document.getElementById('totop')!.style.display = 'block';

    this.loadData();

    console.log(this.awards);
  }

  openDialog(data: Award) {
    this.dialog.open(previewAward, {
      width: '80%',
      data: data,
    });
  }

  loadData() {
    this.mainService.getAwards().subscribe((data) => {
      if (data.status) {
        this.awards = new Array();
        const awardList = data.data;
        awardList.forEach((award: any) => {
          this.mainService.getAwardLogo(award.id).subscribe((logo) => {
            let url = undefined;
            if (logo.data != null) {
              url =
                'https://api.mikenatchapon.me/uploads/' + logo.data.thumbnail;
            }
            this.awards.push({
              id: award.id,
              title: award.title,
              description: award.description,
              link: award.link,
              image_id: award.image_id,
              image_url: url,
              pin: award.pin,
              delete: award.delete,
            });
          });
        });
      }
    });
  }
}

@Component({
  selector: 'award-dialog',
  templateUrl: 'award-dialog.html',
  styleUrls: ['./award.component.scss'],
})
export class previewAward {
  constructor(@Inject(MAT_DIALOG_DATA) public data: Award) {}
}
