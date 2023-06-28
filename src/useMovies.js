import { useEffect, useState } from "react";

const KEY = "81825c12";

export function useMovies(query) {
    const [movies, setMovies] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    useEffect(
        function () {
            //callback?.()

            const controller = new AbortController();
            async function fetchMovies() {

            try {
            setIsLoading(true);
            setError("");

            const res = await fetch(
                `http://www.omdbapi.com/?apikey=${KEY}&s=${query}`,
                { signal: controller.signal }

            );
            if (!res.ok)
                throw new Error("Something went wrong with fetching the movies");
            const data = await res.json();
            if (data.Response === "False") throw new Error("Movie Not found");
            setMovies(data.Search);
            setError("");
            } catch (err) {
            console.log(err.message);
            if (err.name !== "AbortError") {
                setError(err.message);
            }
            } finally {
            setIsLoading(false);
            }
        }

        if (query.length < 2) {
            setMovies([]);
            setError("");
            return;
        }

        fetchMovies();

        return function () {
            controller.abort();
        };
        },
        [query]
    );
    return {movies, error, isLoading}
}
