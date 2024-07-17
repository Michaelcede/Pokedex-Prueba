import { Container, Row } from "reactstrap";
import axios from "axios";
import { useState, useEffect, useRef, useCallback } from "react";
import PokeTarjeta from "../Components/PokeTarjeta";

const Index = () => {
  const [pokemones, setPokemones] = useState([]);
  const [offset, setOffset] = useState(0);
  const limit = 20;
  const observerRef = useRef();

  const getPokemones = async (o, l) => {
    const liga = `https://pokeapi.co/api/v2/pokemon?limit=${l}&offset=${o}`;
    const response = await axios.get(liga);
    const respuesta = response.data;
    if (offset > 0) {
      setPokemones((prev) => [...prev, ...respuesta.results]);
    } else {
      setPokemones(respuesta.results);
    }
  };

  const lastElementRef = useCallback((node) => {
    if (observerRef.current) observerRef.current.disconnect();
    observerRef.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setOffset((prevOffset) => prevOffset + limit);
      }
    });
    if (node) observerRef.current.observe(node);
  }, []);

  useEffect(() => {
    if (offset === 0 && pokemones.length === 0) {
      getPokemones(offset, limit);
    } else if (offset > 0) {
      getPokemones(offset, limit);
    }
  }, [offset]);

  return (
    <Container>
      <Row className="mt-3">
        {pokemones.map((pok, i) => {
          if (i === pokemones.length - 1) {
            return (
              <div ref={lastElementRef} key={i}>
                <PokeTarjeta poke={pok} />
              </div>
            );
          } else {
            return <PokeTarjeta poke={pok} key={i} />;
          }
        })}
      </Row>
    </Container>
  );
};

export default Index;

