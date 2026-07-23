export function ExerciseCard(){
    return(
        <section className="exercise-card">
            <img src="https://i0.wp.com/css-tricks.com/wp-content/uploads/2012/10/threelines.png" alt=""/>
            <div className="exercise-card-details">
                <div className="detail-a">
                    <h3>Exercise Name</h3>
                    <h4>Exercise description</h4>
                </div>
                <div className="detail-b">
                    {/*<p>Difficulty</p>*/}
                </div>
            </div>
        </section>
    );

}