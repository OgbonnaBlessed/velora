import { useNavigate } from "react-router-dom";

const NotFound = () => {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col items-center justify-center h-screen text-center font-Grotesk">
            <h1 className="text-6xl font-bold text-red-600">404</h1>
            <p className="text-xl mt-4">Oops! The page you are looking for does not exist.</p>
            <button 
                type="button"
                onClick={() => {
                    setTimeout(() => {
                        navigate("/")
                    }, 1000);
                }}
                className="mt-6 px-4 py-2 bg-[#48aadf] hover:bg-[#48aadf]/80 active:scale-90 text-white rounded-lg transition-all duration-300 ease-in-out"
            >
                Go Back Home
            </button>
        </div>
    );
};

export default NotFound;