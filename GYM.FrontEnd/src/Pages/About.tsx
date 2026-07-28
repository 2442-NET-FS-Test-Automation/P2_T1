import { Link } from "react-router-dom";
import "../css/About.css";
import img4 from "../img/gymImage-4.jpg";
export function About() {
  return (
    <div className="about-text-layout">
      {/* Return Control Link */}
      <Link to="/" className="about-navigation">
        <button className="back-link-btn">← Return to Home</button>
      </Link>

      <div className="about-header-section">
        <p className="title-text">About GymQuest</p>
      </div>

      {/* Styled Image Section */}
      <div className="header-wrapper">
        <div className="about-hero-image-wrapper">
          <img
            src={img4}
            alt="GymQuest Routine Booking Concept"
            className="about-hero-image"
          />
          <span className="image-caption">
            Transform your passive workout routines into actionable, scheduled
            bookings.
          </span>
        </div>
        <div className="about-header-description wrapper">
          <p className="lead-text">
            GymQuest is built around a single, powerful mission: 
            <br /><br />
            Helping you
            stay committed to your personal fitness journey. By turning your
            workout routines into actionable, scheduled bookings, GymQuest
            bridges the gap between planning a workout and actually completing
            it.
            
          </p>
        </div>
      </div>

      <div className="about-body-content">
        <h2>The Power of Scheduled Routines</h2>
        <p>
          Consistency is the biggest challenge in fitness. GymQuest resolves
          this by moving your workouts from passive lists into a formal booking
          pipeline. When you choose a routine and lock it into a specific time
          slot, you create a psychological contract with your fitness goals. Our
          booking ecosystem holds you accountable, turning fitness intentions
          into real-world results.
        </p>

        <h2>Account Roles & Access Controls</h2>
        <p>
          GymQuest uses a secure, multi-tier account system to ensure that both
          users and personal trainers have the exact tools they need to make
          routine tracking seamless.
        </p>
        <ul>
          <li>
            <h3>Platform Administrators:</h3> Manage core account verifications
            and safely invite certified fitness trainers to the system.
          </li>
          <li>
            <h3>Certified Trainers:</h3> Curate, build, and maintain the central
            routine catalog, while accessing structural popularity reports to
            see which workouts are driving the most member engagement.
          </li>
          <li>
            <h3>Athletes & Consumers:</h3> Search the open catalog, reserve
            workout slots, and manage private biometric data logs in absolute
            isolation.
          </li>
        </ul>

        <h2>Core Platform Modules</h2>
        <p>
          To help you seamlessly move from choosing a routine to logging your
          performance, GymQuest is broken down into specialized functional
          spaces:
        </p>
        <ul>
          <li>
            <h3>Routine Booking Engine:</h3> Browse the public catalog and
            filter available workouts by muscle group, location, or difficulty
            rating. Once you find a track that fits your goals, lock it directly
            into your calendar.
          </li>
          <li>
            <h3>Private Transaction Logs:</h3> View your chronological workout
            history with strict data privacy boundaries. You can review your
            past booking completions, but no other user can ever access your
            training record.
          </li>
          <li>
            <h3>Biometric Telemetry & Progress Charts:</h3> Document shifts in
            your weight, muscular strength ceilings, and cardiovascular
            endurance to build data-driven visual history maps over time.
          </li>
          <li>
            <h3>Gamified Achievement Trackers:</h3> Drive consistent booking
            habits with automated sequence monitors. Consistently booking and
            completing your routines triggers active streak counters, milestone
            achievements, and status badges.
          </li>
          <li>
            <h3>Integrated Notification Gateway:</h3> Stay ahead of your
            schedule with automatic booking confirmations, routine reminders,
            and real-time platform updates sent straight to your device.
          </li>
        </ul>
      </div>
    </div>
  );
}
