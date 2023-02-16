import React, { useContext } from "react";
import { Link } from "react-router-dom";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Rating from "./Rating";
import { Store } from "../Store";
import axios from "axios";

export default function Product(props) {
  const { product } = props;
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    cart: { cartItems },
  } = state;

  const addToCartHandler = async (item) => {
    const existItem = cartItems.find((x) => x._id === product._id);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(`/api/products/${item._id}`);
    if (data.countInStocks < quantity) {
      window.alert("Sorry, Product is out of stock");
      return;
    }

    ctxDispatch({
      type: "ADD_CART_ITEMS",
      payload: { ...item, quantity },
    });
  };
  return (
    <Card>
      <Link to={`/product/${product.slug}`}>
        <img src={product.image} alt={product.name} className="card-img-top" />
      </Link>{" "}
      <Card.Body>
        <Link to={`/product/${product.slug}`}>
          <Card.Title> {product.name} </Card.Title>{" "}
        </Link>{" "}
        <Rating
          rating={product.rating}
          numReviews={product.numReviews}
        ></Rating>{" "}
        <Card.Text> $ {product.price} </Card.Text>{" "}
        {product.countInStocks === 0 ? (
          <Button variant="light" disabled>
            Out of Stock
          </Button>
        ) : (
          <Button
            onClick={() => {
              addToCartHandler(product);
            }}
          >
            Add to cart
          </Button>
        )}
      </Card.Body>{" "}
    </Card>
  );
}
