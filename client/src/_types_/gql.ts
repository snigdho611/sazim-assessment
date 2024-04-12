import { gql } from "@apollo/client";

export const PRODUCT_LIST_QUERY = gql`
  query Query {
    products {
      id
      title
      description
      price
      rent
      posted
      views
      status
      category_product {
        category {
          id
          name
        }
      }
    }
  }
`;

export const SINGLE_PRODUCT_QUERY = gql`
  query Query($id: String!) {
    product(id: $id) {
      id
      title
      description
      price
      rent
      posted
      views
      status
      category_product {
        id
        category {
          id
          name
        }
      }
    }
  }
`;

export const UPDATE_PRODUCT_QUERY = gql`
  mutation Mutation(
    $id: ID
    $title: String
    $description: String
    $price: Int
    $category: [String]
    $rent: Int
  ) {
    productUpdate(
      id: $id
      title: $title
      description: $description
      price: $price
      category: $category
      rent: $rent
    ) {
      id
      title
      price
      price
      rent
      posted
      views
      category_product {
        id
        category {
          name
        }
      }
    }
  }
`;

export const CATEGORY_LIST_QUERY = gql`
  query Query {
    category {
      id
      name
    }
  }
`;

export const LOGIN_QUERY = gql`
  query Query($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      id
      email
      status
      user {
        id
        first_name
        last_name
        address
        phone
      }
    }
  }
`;

export const SIGNUP_QUERY = gql`
  mutation Mutation(
    $first_name: String!
    $last_name: String!
    $email: String!
    $password: String!
    $address: String!
    $phone: String!
  ) {
    signup(
      first_name: $first_name
      last_name: $last_name
      email: $email
      password: $password
      address: $address
      phone: $phone
    ) {
      email
      first_name
      last_name
      address
      phone
    }
  }
`;