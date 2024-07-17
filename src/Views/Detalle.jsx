import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import {Col,Card,CardBody,CardFooter,CardImg,Badge, Container, Row, CardText, Progress} from 'reactstrap'
import axios from 'axios'


const Detalle = () => {
    const {id} = useParams();
    const[pokemon,setPokemon] = useState([]);
    const[especie,setEspecie] = useState([]);
    const[habitat,setHabitat] = useState('Desconocido');
    const[descripcion,setDescripcion] = useState([]);
    const[imagen,setImagen] = useState([]);
    const[tipos,setTipos] = useState([]);
    const[habilidades,setHabilidades] = useState([]);
    const[estadisticas,setEstadisticas] = useState([]);

    const [cardClass, setCardClass] = useState('d-none');
    const [loadClass, setLoadClass] = useState('');

    const getPokemon = async()=>{
        const liga = 'https://pokeapi.co/api/v2/pokemon/'+id;
        try {
            const response = await axios.get(liga);
            const respuesta = response.data;
            setPokemon(respuesta);
            if (respuesta.sprites.other.dream_world.front_default != null) {
                setImagen(respuesta.sprites.other.dream_world.front_default);
            } else {
                setImagen(respuesta.sprites.other['official-artwork'].front_default);
            }
            await getEspecie(respuesta.species.name);
            await getHabilidades(respuesta.abilities);
            await getEstadisticas(respuesta.stats);
            await getTipos(respuesta.types);
            setCardClass('');
            setLoadClass('d-none');
        } catch (error) {
            console.error('Error al obtener el Pokémon:', error);
        }
    }

    const getTipos = async(tip)=>{
        let listaTipos = [];
        tip.forEach( (t) => {
            axios.get(t.type.url).then( async(response) =>{
                listaTipos.push(response.data.names[5].name);
                setTipos(listaTipos);
            })
        })
    }

    const getHabilidades = async(hab)=>{
        let listaHab = [];
        hab.forEach( (h) => {
            axios.get(h.ability.url).then( async(response) =>{
                listaHab.push(response.data.names[5].name);
                setHabilidades(listaHab);
            })
        })
    }

    const getEspecie = async(esp)=>{
        const liga = 'https://pokeapi.co/api/v2/pokemon-species/'+esp;
        try {
            const response = await axios.get(liga);
            const respuesta = response.data;
            setEspecie(respuesta);
            if (respuesta.habitat != null) {
                await getHabitat(respuesta.habitat.url);
            }
            await getDescripcion(respuesta.flavor_text_entries);
        } catch (error) {
            console.error('Error al obtener las especies: ', error);
        }
    }

    const getHabitat = async(hab)=>{
        axios.get(hab).then(async(response) =>{
            setHabitat(response.data.names[1].name)
        })
    }

    const getDescripcion = async(desc)=>{
        let texto = '';
        desc.forEach( (d)=>{
            if(d.language.name == 'es'){
                texto = d.flavor_text;
            }
            if(texto == '' && desc.length > 0){
                texto = desc[0].flavor_text;
            }
        })
        setDescripcion(texto);
    }

    const getEstadisticas = async(es)=>{
        let listaEs = [];
        es.forEach( (h) => {
            axios.get(h.stat.url).then( async(response) =>{
                listaEs.push({'nombre':response.data.names[5].name, 'valor': h.base_stat});
                setEstadisticas(listaEs);
            })
        })
    }

    useEffect( () =>{
        getPokemon();
    },[])

    return (
        <Container className='bg-secondary mt-3'>
            <Row>
                <Col>
                <Card className='shadow mt-3 mb-3'>
                    <CardBody className='mt-3'>
                        <Row>
                            <Col className='text-end'>
                                <Link to='/' className='btn btn-dark text-white'>
                                <i className='fa-solid fa-home text-white'></i> Inicio
                                </Link>
                            </Col>
                        </Row>
                        <Row className={loadClass}>
                            <Col md='12'>
                                <img src='/img/pokeGIF2.gif' className='gif-responsive' alt='Snorlax Gif'></img>
                            </Col>
                        </Row>
                        <Row className={cardClass}>
                            <Col md='6'>
                                <CardText className='h1 text-capitalize'>{pokemon.name}</CardText>
                                <CardText className='fs-3'>{descripcion}</CardText>
                                <CardText className='fs-5'>
                                    Altura: <b>{(pokemon.height)/10} m </b>
                                    Peso: <b>{(pokemon.weight)/10} kg</b>
                                </CardText>
                                <CardText className='fs-5'>
                                    Tipo: {' '}
                                    { tipos.map( (tip,i) => (
                                        <Badge pill className='me-1' color='danger' key={i}>
                                            {tip}
                                        </Badge>
                                    ))}
                                </CardText>
                                <CardText className='fs-5'>
                                    Habilidades:  {' '}
                                    { habilidades.map( (hab,i) => (
                                        <Badge pill className='me-1' color='dark' key={i}>
                                            {hab}
                                        </Badge>
                                    ))}
                                </CardText>
                                <CardText className='fs-5 text-capitalize'>
                                    Habitat: <b>{habitat}</b>
                                </CardText>
                            </Col>
                            <Col md='6'>
                                <img src={imagen} className='img-fluid'></img>
                            </Col>
                            <Col md='12 mt-3'>
                                <CardText className='fs-4 text-center'><b>Estadísticas</b></CardText>
                            </Col>
                            {estadisticas.map( (es,i) => (
                                <Row key={i}>
                                    <Col xs='6' md='3'><b>{es.nombre}</b></Col>
                                    <Col xs='6' md='9'>
                                        <Progress className='my-2' value={es.valor}>{es.valor}</Progress>
                                    </Col>
                                </Row>
                            ))} 
                        </Row>
                    </CardBody>
                </Card>
                </Col>
            </Row>
        </Container>
    )
}

export default Detalle