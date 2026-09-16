<?php

namespace Tests\Feature;

use App\Models\Student;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class StudentCrudTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_list_all_students(): void
    {
        Student::factory(3)->create();

        $response = $this->getJson(route('students.index'));

        $response->assertOk()
            ->assertJsonCount(3);
    }

    public function test_can_search_students(): void
    {
        Student::factory()->create([
            'first_name' => 'Alice',
            'last_name' => 'Smith',
            'email' => 'alice@example.com',
        ]);
        Student::factory()->create([
            'first_name' => 'Bob',
            'last_name' => 'Jones',
            'email' => 'bob@example.com',
        ]);

        $response = $this->getJson(route('students.index', ['search' => 'Alice']));

        $response->assertOk()
            ->assertJsonCount(1)
            ->assertJsonFragment(['first_name' => 'Alice']);
    }

    public function test_can_create_a_student(): void
    {
        $data = [
            'first_name' => 'John',
            'last_name' => 'Doe',
            'email' => 'johndoe@example.com',
            'program' => 'BSIT',
            'gender' => 'male',
            'birthday' => '2004-05-15',
            'yr_level' => '3',
        ];

        $response = $this->postJson(route('students.store'), $data);

        $response->assertCreated()
            ->assertJsonPath('message', 'Student created successfully.')
            ->assertJsonPath('student.first_name', 'John')
            ->assertJsonPath('student.email', 'johndoe@example.com');

        $this->assertDatabaseHas('students', [
            'email' => 'johndoe@example.com',
            'first_name' => 'John',
        ]);
    }

    public function test_cannot_create_student_with_missing_fields(): void
    {
        $response = $this->postJson(route('students.store'), []);

        $response->assertUnprocessable()
            ->assertJsonValidationErrors([
                'first_name',
                'last_name',
                'email',
                'program',
                'gender',
                'birthday',
                'yr_level',
            ]);
    }

    public function test_cannot_create_student_with_duplicate_email(): void
    {
        Student::factory()->create(['email' => 'duplicate@example.com']);

        $response = $this->postJson(route('students.store'), [
            'first_name' => 'Jane',
            'last_name' => 'Doe',
            'email' => 'duplicate@example.com',
            'program' => 'BSCS',
            'gender' => 'female',
            'birthday' => '2005-01-01',
            'yr_level' => '2',
        ]);

        $response->assertUnprocessable()
            ->assertJsonValidationErrors(['email']);
    }

    public function test_can_show_individual_student(): void
    {
        $student = Student::factory()->create([
            'first_name' => 'Maria',
            'email' => 'maria@example.com',
        ]);

        $response = $this->getJson(route('students.show', $student));

        $response->assertOk()
            ->assertJsonPath('id', $student->id)
            ->assertJsonPath('first_name', 'Maria')
            ->assertJsonPath('email', 'maria@example.com');
    }

    public function test_can_update_a_student(): void
    {
        $student = Student::factory()->create([
            'first_name' => 'OldName',
            'program' => 'BSIT',
        ]);

        $response = $this->putJson(route('students.update', $student), [
            'first_name' => 'NewName',
            'program' => 'BSCS',
        ]);

        $response->assertOk()
            ->assertJsonPath('message', 'Student updated successfully.')
            ->assertJsonPath('student.first_name', 'NewName')
            ->assertJsonPath('student.program', 'BSCS');

        $this->assertDatabaseHas('students', [
            'id' => $student->id,
            'first_name' => 'NewName',
            'program' => 'BSCS',
        ]);
    }

    public function test_can_delete_a_student(): void
    {
        $student = Student::factory()->create();

        $response = $this->deleteJson(route('students.destroy', $student));

        $response->assertOk()
            ->assertJsonPath('message', 'Student deleted successfully.');

        $this->assertDatabaseMissing('students', [
            'id' => $student->id,
        ]);
    }
}

