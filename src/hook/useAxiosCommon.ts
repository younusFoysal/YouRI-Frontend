import axios from 'axios';

const useAxiosCommon = () => {


    const axiosCommon = axios.create({
        baseURL: 'http://localhost:3000/api/v1',
        headers: {
            'Content-Type': 'application/json'
        }
    });


    return axiosCommon;
};

export default useAxiosCommon;
