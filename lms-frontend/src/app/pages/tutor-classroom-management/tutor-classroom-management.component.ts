import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

interface Student {
  _id: string;
  name: string;
  email: string;
}

interface Assignment {
  _id: string;
  title: string;
  description: string;
  dueDate: string;
  submissions: any[];
}

interface Classroom {
  _id: string;
  name: string;
  description: string;
  tutor: string;
  students: Student[];
  assignments: Assignment[];
}

@Component({
  selector: 'app-tutor-classroom-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="max-w-7xl mx-auto px-4 py-10">
      <!-- Header -->
      <header class="mb-10">
        <h1 class="text-4xl font-bold text-gray-900">My Classrooms</h1>
        <p class="text-gray-600 mt-2">Manage your classrooms and track student progress</p>
      </header>

      <!-- Loading State -->
      <div *ngIf="loading" class="flex justify-center items-center py-12">
        <span class="text-lg text-gray-600 animate-pulse">Loading classrooms...</span>
      </div>

      <!-- Error State -->
      <div *ngIf="error" class="bg-red-100 text-red-700 px-4 py-3 rounded mb-6">
        {{ error }}
      </div>

      <!-- Classrooms -->
      <div *ngIf="!loading && !error" class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div *ngFor="let classroom of classrooms" class="border rounded-xl shadow p-6 bg-white">
          <div class="flex justify-between items-start mb-6">
            <div>
              <h2 class="text-xl font-bold text-gray-800">{{ classroom.name }}</h2>
              <p class="text-gray-600 mt-1">{{ classroom.description }}</p>
            </div>
            <button 
              (click)="showAssignmentForm(classroom._id)" 
              class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
            >
              + Assignment
            </button>
          </div>

          <!-- Students -->
          <section class="mb-6">
            <div class="flex justify-between items-center mb-3">
              <h3 class="font-semibold text-gray-800">Students</h3>
              <span class="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">{{ classroom.students.length }} Enrolled</span>
            </div>
            <div *ngIf="classroom.students.length === 0" class="text-sm text-gray-500 italic">
              No students assigned
            </div>
            <div *ngIf="classroom.students.length > 0" class="space-y-3">
              <div *ngFor="let student of classroom.students" class="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-semibold">
                    {{ student.name.charAt(0) }}
                  </div>
                  <div>
                    <p class="font-medium text-gray-800">{{ student.name }}</p>
                    <p class="text-sm text-gray-600">{{ student.email }}</p>
                  </div>
                </div>
                <button class="text-blue-600 hover:underline text-sm">View Progress</button>
              </div>
            </div>
          </section>

          <!-- Assignments -->
          <section>
            <div class="flex justify-between items-center mb-3">
              <h3 class="font-semibold text-gray-800">Assignments</h3>
              <span class="text-sm bg-yellow-100 text-yellow-800 px-2 py-1 rounded">{{ classroom.assignments.length }} Total</span>
            </div>
            <div *ngIf="classroom.assignments.length === 0" class="text-sm text-gray-500 italic">
              No assignments created
            </div>
            <div *ngIf="classroom.assignments.length > 0" class="space-y-3">
              <div *ngFor="let assignment of classroom.assignments" class="p-4 border rounded-md bg-gray-50">
                <div class="flex justify-between items-start">
                  <div>
                    <h4 class="font-semibold text-gray-800">{{ assignment.title }}</h4>
                    <p class="text-sm text-gray-600">{{ assignment.description }}</p>
                  </div>
                  <span [ngClass]="{
                    'bg-green-100 text-green-800': assignment.submissions.length > 0,
                    'bg-yellow-100 text-yellow-800': assignment.submissions.length === 0
                  }" class="text-sm px-2 py-1 rounded">
                    {{ assignment.submissions.length }} Submissions
                  </span>
                </div>
                <div class="mt-2 flex justify-between items-center text-sm text-gray-600">
                  <div>Due: {{ assignment.dueDate | date:'mediumDate' }}</div>
                  <button class="text-blue-600 hover:underline">View Submissions</button>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      <!-- Modal -->
      <div *ngIf="showModal" class="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
        <div class="bg-white rounded-lg w-full max-w-md mx-4 p-6 relative">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-semibold text-gray-800">New Assignment</h3>
            <button (click)="closeModal()" class="text-gray-400 hover:text-gray-600">
              ✕
            </button>
          </div>
          <form (ngSubmit)="createAssignment()" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input 
                type="text" 
                [(ngModel)]="newAssignment.title" 
                name="title"
                class="w-full border border-gray-300 rounded-md px-3 py-2"
                placeholder="Assignment title"
                required
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea 
                [(ngModel)]="newAssignment.description" 
                name="description"
                class="w-full border border-gray-300 rounded-md px-3 py-2"
                rows="3"
                placeholder="Assignment description"
                required
              ></textarea>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
              <input 
                type="datetime-local" 
                [(ngModel)]="newAssignment.dueDate"
                name="dueDate"
                class="w-full border border-gray-300 rounded-md px-3 py-2"
                required
              />
            </div>
            <div class="flex justify-end gap-3 mt-4">
              <button 
                type="button" 
                (click)="closeModal()" 
                class="px-4 py-2 border border-gray-300 rounded-md text-gray-600 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                [disabled]="!newAssignment.title || !newAssignment.description || !newAssignment.dueDate"
              >
                Create
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class TutorClassroomManagementComponent implements OnInit {
  classrooms: Classroom[] = [];
  loading = true;
  error = '';
  showModal = false;
  selectedClassroomId = '';
  newAssignment = {
    title: '',
    description: '',
    dueDate: ''
  };

  constructor(private router: Router) {}

  ngOnInit() {
    this.getClassrooms();
  }

  async getClassrooms() {
    try {
      this.loading = true;
      this.error = '';

      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch('http://localhost:5000/api/classrooms/tutor-classrooms', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        if (response.status === 401) throw new Error('Please log in to view your classrooms');
        if (response.status === 403) throw new Error('You do not have permission to view classrooms');
        throw new Error('Failed to fetch classrooms');
      }

      const data = await response.json();
      this.classrooms = data.classrooms || [];
    } catch (err: any) {
      this.error = err.message || 'Failed to fetch classrooms';
    } finally {
      this.loading = false;
    }
  }

  showAssignmentForm(classroomId: string) {
    this.selectedClassroomId = classroomId;
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.selectedClassroomId = '';
    this.newAssignment = { title: '', description: '', dueDate: '' };
  }

  async createAssignment() {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token found');

      const response = await fetch('http://localhost:5000/api/classrooms/add-assignment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          classroomId: this.selectedClassroomId,
          ...this.newAssignment
        })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to create assignment');
      }

      await this.getClassrooms();
      this.closeModal();
    } catch (err: any) {
      this.error = err.message || 'Failed to create assignment';
    }
  }
}
