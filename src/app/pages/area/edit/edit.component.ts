import { Component, OnInit, ViewChild, SimpleChanges, Input } from '@angular/core';
import { MatPaginator, } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { MatDialogConfig } from '@angular/material/dialog';
import { DialogService } from 'src/app/shared/dialog.service';
import { NotificationService } from 'src/app/shared/notification.service';
import { ExcelService } from 'src/app/helper/excel.service';
import { AreaService } from 'src/app/shared/area.service';
import { CreateComponent } from '../create/create.component';
import { MatTableDataSource } from '@angular/material/table';
@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {


  displayedColumns: string[] = ['NAME', 'LST', 'UPDATE'];
  checker;
  dataArray: MatTableDataSource<any>;
  tableData = []
  start_date = new Date();
  end_date = new Date();
  searchKey;

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  constructor(private service: AreaService,
    private notificationService: NotificationService, private dialog: MatDialog,
    private dialogService: DialogService, private excelService: ExcelService) { }

  ngOnInit() {
    this.loadData();
  }


  setEndDate(event): void {
    this.end_date = event;
  }

  setStartDate(event): void {
    this.start_date = event;
  }

  loadData() {

    this.service.getAll().subscribe(data => {
      if (data) {
        this.tableData = []
        this.dataArray = new MatTableDataSource<any>(this.tableData);
        this.dataArray.filterPredicate = (data: any, filterValue: string) => {
          const dataStr = JSON.stringify(data).toLowerCase();
          return dataStr.indexOf(filterValue) != -1;
        }
        this.dataArray.filter = ''
        this.dataArray.paginator = this.paginator;

        if (data.length > 0) {
          console.table(data)

          data.forEach(element => {
            this.tableData.push(element)
          });

          this.dataArray = new MatTableDataSource<any>(this.tableData);
          this.dataArray.filterPredicate = (data: any, filterValue: string) => {
            const dataStr = JSON.stringify(data).toLowerCase();
            return dataStr.indexOf(filterValue) != -1;
          }
          this.dataArray.filter = ''
          this.dataArray.paginator = this.paginator;
        }

      }

    },
      error => {
        this.notificationService.warn(error.message)
      });
  }


  onSearchClear() {
    this.applyFilter("");
  }


  applyFilter(filterValue: string) {
    this.dataArray.filter = filterValue.trim().toLowerCase();
    // this.dataArray.filterPredicate = function (data, filter: string): boolean {
    //   return data.name.toLowerCase().includes(filter) || data.lastModifiedDate.toLowerCase().includes(filter);
    // };
  }


  onCreate() {
    this.service.initializeFormGroup();
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "60%";
    let dialogRef = this.dialog.open(CreateComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(data => {

      this.loadData();
    });

  }


  onEdit(row) {
    this.service.populateForm(row);
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "60%";
    let dialogRef = this.dialog.open(CreateComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(data => {

      this.loadData();
    });
  }

  onDelete($key) {
    this.dialogService.openConfirmDialog('Are you sure?')
      .afterClosed().subscribe(res => {

        if (res) {
          this.service.deleteById($key).subscribe(() => {
            this.notificationService.success('Deleted Successfully');
            this.loadData();
          },
            error => {
              this.notificationService.warn(error.message)

            });
        }
      });
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log('gggggggggggggggg')
    this.loadData();

  }

  exportAsXLSX(): void {
    this.excelService.exportAsExcelFile('sample');
  }
}
