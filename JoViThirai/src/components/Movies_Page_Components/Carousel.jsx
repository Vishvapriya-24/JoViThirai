import axios from "axios";
import {useContext, useEffect, useState} from 'react';
import BootCarousel from "react-bootstrap/Carousel";
import { MyContext } from "../../App";
import {useQuery}  from '@tanstack/react-query';
import CarouselSkeleton from "./CarouselSkeleton";
const API = import.meta.env.VITE_API_URL;

const FetchCarouselData = async() =>{
  console.log(API)
  const res = await axios.get(`${API}/carousel`);
  return res.data;
}

function Carousel() {
  const {data,isLoading,isError,error,isFetching}=useQuery({
    queryKey : ["carousel"],
    queryFn : FetchCarouselData,
  })

  if (isLoading) return <CarouselSkeleton />;
  if(isError) return <h1>Error while fetching Reload it.{error}</h1> ;

  const styles = {
    image: {
      width: "100%",
      height: "450px",
      objectPosition:"center",
    },
    caption: {
      bottom: "40px",
      background: "rgba(0,0,0,0.6)",
      padding: "10px 20px",
      borderRadius: "8px",
    },
    carousel: {
      backgroundColor: "#000",
    },
  };

  return (
    <BootCarousel interval={1000}>
      {data.length && data.map((movie) => (
        <BootCarousel.Item key={movie.id}>
          <img
            style = {styles.image}
            className="d-block w-10"
            src={movie.poster}
            alt={movie.title}
          />
          <BootCarousel.Caption>
            <h3>{movie.title}</h3>
            <p>{movie.overview || "No description available."}</p>
          </BootCarousel.Caption>
        </BootCarousel.Item>
      ))}
    </BootCarousel>
  );
}

export default Carousel;
