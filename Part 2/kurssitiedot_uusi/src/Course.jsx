import React from "react";

const Header = ({ name }) => {
    return <h1>{name}</h1>; 
  };
  
  const Part = ({ name, exercises }) => (
    <p>
      {name} {exercises}
    </p>
  );
  
  const Content = ({ parts }) => {
    return (
      <div>
        {parts.map(part => (
          <Part key={part.id} name={part.name} exercises={part.exercises} />
        ))}
      </div>
    );
  };
  
  const Course = ({ course }) => {
      console.log("Course received:", course);
      const totalExercises = course.parts.reduce((sum, part) => sum + part.exercises, 0)
  
      return (
        <div>
          <Header name={course.name} />
          <Content parts={course.parts} />
          <p><strong>Total exercises: {totalExercises}</strong></p>
        </div>
      )
    }
;
export default Course;