import { useEffect, useState } from "react";
import axios from "axios";

//Will display the summaries of the peer reviews from all students
function Peers_Summary() {
  const [peer_review, setPeerReview] = useState([]);

  const [student_review_count,setCount]= useState([]);
  const [student_Average_Score,setAverage]= useState([]);

  function getStudentAverageScore(student)
  {
    //get all information tied to same user_id and calculate the average and store into student_Average_score
  }









  //Fetching the peer_reviews and storing the information into peer_review array
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch("http://localhost:8080/peer_reviews");
        const data = await response.json();
        setPeerReview(data);
        console.log(data);
      } catch (error) {
        console.log("Error fetching peer reviews", error);
      }
    };
    fetchReviews();
  }, []);

 
  
  //Fetching the review counts list
  useEffect(() => {
    const fetchReviewCount = async () => {
      try {
        const response = await fetch("http://localhost:8080/peer_reviews/review-counts");
        const data = await response.json();
        setCount(data);
      } catch (error) {
        console.error("Error fetching student members:", error);
      }
    };

    fetchReviewCount();
  }, []);

  //Function to find the student with matching user_id to return the amount of people who review said student
   function getReviewScore(student){
    const matchedStudent= student_review_count.find((user)=>student.user_id=== user.user_id);
    
    return matchedStudent?matchedStudent.review_count:0;
   }
   //Function to calculate the total criteria average as totalAverage
   function getTotalAverageScore(student)
   {
      const totalAverage=(student.Cooperation+student.Conceptional_Contribution+student.Practical_Contribution+student.Work_Ethic)/4;
      return totalAverage;
   }
  return (
    <div className="SVContainer">
        <h1>Summary of Student Reviews</h1>
      <table className="table">
      
        <thead>

        <tr>
          <th scope="col">Student ID</th>
          <th scope="col">Last Name</th>
          <th scope="col">First Name</th>
          <th scope="col">Team</th>
          <th scope="col">Cooperation</th>
          <th scope="col">Conceptual</th>
          <th scope="col">Practical</th>
          <th scope="col">Work Ethic</th>
          <th scope="col">Average</th>
          <th scope="col">Peers who responded</th>
        </tr>
        </thead>
        <tbody>

        {peer_review.map((student) => (
          <tr key={student.user_id}>
            <th scope="row">{student.user_id}</th>
            <td>{student.last_name}</td>
            <td>{student.first_name}</td>
            <td>{student.team_name}</td>
            <td>{student.Cooperation}</td>
            <td>{student.Conceptional_Contribution}</td>
            <td>{student.Practical_Contribution}</td>
            <td>{student.Work_Ethic}</td>
            <td> {getTotalAverageScore(student)}</td>
            <td >{getReviewScore(student)}
            </td>
          
          </tr>
        ))}
        </tbody>
      </table>
    </div>
  );
}

export default Peers_Summary;
