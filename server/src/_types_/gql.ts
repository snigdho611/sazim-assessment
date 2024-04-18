const GQLTypes = `#graphql

    type Auth{
        id: ID,
        email: String,
        password: String,
        status: Boolean,
        admin: Boolean,
        user: User,
        token: String
    }
    
    type User{
        id: ID,
        first_name: String,
        last_name: String,
        address: String,
        phone: String
    }

    type AuthInstance{
        id: ID,
        first_name: String,
        email: String,
        last_name: String,
        address: String,
        phone: String
    }

    type ErrorAuthInstance{
        error: String,
    }

    type Product{
        id: ID,
        title: String,
        description: String,
        price: Int,
        rent_amount:Int,
        rent_rate: String,
        posted: String,
        views: Int,
        status: String
        category_product: [Category_Product],
    }

    type Category{
        id: ID,
        name: String,
        created: String,
    }

    type Category_Product{
        id: ID,
        categoryId: String,
        category: Category,
        product: Product,
        productId: String
    }

    type Rent_Instance{
        id:        ID,
        product:   String,
        productId: Int,
        from:      String,
        to:        String,
        user:      User
        userId:    Int
    }

    type Query{
        login(email: String!, password: String!): Auth,
        users: [User],
        allProducts: [Product]
        oneProduct(id: String!): Product
        category: [Category]
    }

    type Mutation{
        signup(
            first_name: String!, 
            last_name: String!,
            address: String!,
            email: String!,
            phone: String!,
            password: String!
        ): AuthInstance,
        productAdd(
            title: String!,
            description: String!,
            price: Int!,
            rent_amount: Int!,
            rent_rate: String!,
            category: [String],
            posted: String!,
        ): Product,
        productUpdate(
            id: ID
            title: String,
            description: String,
            category: [String],
            price: Int,
            rent_amount: Int,
            rent_rate: String
        ): Product,
        rentProduct(
            productId: Int,
            userId: Int,
            from: String,
            to: String
        ): Rent_Instance
    }
`;

export default GQLTypes;