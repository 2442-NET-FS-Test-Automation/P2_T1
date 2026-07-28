import { useNavigate } from "react-router-dom";



export function NotFound(){
    const navigate = useNavigate();

    return(
        <article className="container d-flex flex-column justify-content-center align-items-center text-center vh-100">

            <h1 className="display-1 fw-bold text-danger">
                404
            </h1>

            <h2 className="mb-3">
                Looks like we don't have what you're looking for.
            </h2>

            <p className="lead text-muted w-75">
                Try another URL, or use the button below to return to the home page.
            </p>

            <button
                className="btn btn-neon rounded-pill px-5 py-3 fw-bold text-uppercase shadow-neon"
                onClick={() => navigate('/')}
            >
                Be Free, Go Home
            </button>

        </article>
    )
}   