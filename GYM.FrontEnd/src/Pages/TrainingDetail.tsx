import { ExerciseCard } from "../Components/ExerciseCard"
export function TrainingDetail(){
    return(
        <>
            <h2>Exercises on this training</h2>
            <section className="exercise-list">
                <ExerciseCard/>
                <ExerciseCard/>
                <ExerciseCard/>
                <ExerciseCard/>
            </section>
        </>
    )
}