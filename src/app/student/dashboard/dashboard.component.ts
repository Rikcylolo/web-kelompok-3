import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddStudentComponent } from 'src/app/components/add-student/add-student.component';
import { EditStudentComponent } from 'src/app/components/edit-student/edit-student.component';
import { Student } from 'src/app/student';
import { StudentService } from 'src/app/services/student.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  students: Student[] = [];
  id!: string;

  constructor(
    private studentService: StudentService,
    private modalService: NgbModal
  ) {
    
  }

  ngOnInit(): void {
    this.studentService.getAll().subscribe((students: Student[]) => {
      this.students = students;
    }) 
  }

  hapus(id: string) {
    Swal.fire({
      title: 'Are you sure want to delete?',
      showCloseButton: true,
      showDenyButton: true,
      
      confirmButtonText: 'OK',
      denyButtonText: `Cancel`,
    }).then((result) => {
      if (result.isConfirmed) {
        this.studentService.delete(id).subscribe(() => {
          Swal.fire({
            text: 'Employee was deleted',
            target: '#custom-target',
            customClass: {
              container: 'position-absolute'
            },
            toast: true,
            position: 'bottom-right'
          }
          )
          const idx = this.students.findIndex(q => q._id === id);
          this.students.splice(idx, 1);
        });
      }
    })
  }

  editModal(student: Student, id: string) {
    const modal = this.modalService.open(EditStudentComponent, {centered: true, ariaLabelledBy: 'modal-basic-title'});
    modal.componentInstance.student = student;
    modal.result.then(student => {
      this.studentService.update(id, student)
      .subscribe(student => {
        const idx = this.students.findIndex(q => q._id === id);
        this.students[idx] = {...this.students[idx], ...student};
        Swal.fire({
          text: 'Employee was updated',
          target: '#custom-target',
          customClass: {
            container: 'position-absolute'
          },
          toast: true,
          position: 'bottom-right'
        }
        )
      });
    }).catch(e => console.log(e));
  }

  addModal() {
    const modal = this.modalService.open(AddStudentComponent, {centered: true});
    modal.result.then(student => {
      this.studentService.create(student)
      .subscribe(student => this.students.push(student));
      Swal.fire({
        text: 'Employee was added',
        target: '#custom-target',
        customClass: {
          container: 'position-absolute'
        },
        toast: true,
        position: 'bottom-right'
      }
      )
    }).catch(e => console.log(e));
  }

}
