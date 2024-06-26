import { prisma } from "../config/prisma";

class _Product_ {
    async allProductsQuery(
        _: any,
        args: {
            userId: number;
            filter: "self" | "others" | "bought" | "sold" | "borrowed" | "lent";
        }
    ) {
        let products;
        switch (args.filter) {
            case "others": {
                products = await prisma.product.findMany({
                    where: {
                        NOT: {
                            userId: Number(args.userId),
                        },
                        status: true,
                    },
                    include: {
                        category_product: {
                            include: {
                                category: true,
                            },
                            take: 100,
                        },
                        user: true,
                    },
                });
                break;
            }
            case "self": {
                products = await prisma.product.findMany({
                    where: {
                        userId: Number(args.userId),
                        status: true,
                    },
                    include: {
                        category_product: {
                            include: {
                                category: true,
                            },
                            take: 100,
                        },
                        user: true,
                    },
                });
                break;
            }
            case "bought": {
                const purchases = await prisma.purchases.findMany({
                    where: {
                        userId: Number(args.userId),
                    },
                });
                console.log(purchases);
                products = await prisma.product.findMany({
                    where: {
                        // userId: Number(args.userId),
                        id: {
                            in: purchases.map((element) => {
                                return element.productId;
                            }),
                        },
                        status: true,
                    },
                    include: {
                        category_product: {
                            include: {
                                category: true,
                            },
                            take: 100,
                        },
                        user: true,
                    },
                });
                break;
            }
            case "sold": {
                const purchases = await prisma.purchases.findMany({
                    where: {
                        product: {
                            userId: Number(args.userId),
                        },
                        // userId: Number(args.userId),
                    },
                });
                console.log(purchases);
                products = await prisma.product.findMany({
                    where: {
                        // userId: Number(args.userId),
                        id: {
                            in: purchases.map((element) => {
                                return element.productId;
                            }),
                        },
                        status: true,
                    },
                    include: {
                        category_product: {
                            include: {
                                category: true,
                            },
                            take: 100,
                        },
                        user: true,
                    },
                });
                break;
            }
            case "borrowed": {
                const productIds = await prisma.rent_Instance.findMany({
                    where: {
                        userId: Number(args.userId),
                    },
                });
                console.log(productIds);
                products = await prisma.product.findMany({
                    where: {
                        id: {
                            in: productIds.map((element) => {
                                return element.productId;
                            }),
                        },
                        status: true,
                    },
                    include: {
                        rent_instance: true,
                        user: true,
                        category_product: {
                            include: {
                                category: true,
                            },
                            take: 100,
                        },
                    },
                });
                // console.log(products);
                break;
            }
            case "lent": {
                const productIds = await prisma.rent_Instance.findMany({
                    where: {
                        product: {
                            userId: Number(args.userId),
                        },
                    },
                    include: {
                        product: true,
                    },
                });
                console.log(productIds);
                products = await prisma.product.findMany({
                    where: {
                        userId: Number(args.userId),
                        id: {
                            in: productIds.map((element) => {
                                return element.product.userId;
                            }),
                        },
                        status: true,
                    },
                    include: {
                        rent_instance: true,
                        user: true,
                        category_product: {
                            include: {
                                category: true,
                            },
                            take: 100,
                        },
                    },
                });
                // console.log(products);
                break;
            }
            default:
                break;
        }
        return products;
    }

    async oneProductQuery(_: any, args: { id: string }) {
        const product = await prisma.product.findFirst({
            where: {
                id: Number(args.id),
            },
            include: {
                category_product: {
                    include: {
                        category: true,
                    },
                },
                user: true,
            },
        });
        // console.log(product?.category_product);
        return product;
    }

    async productAddMutation(
        _: any,
        args: {
            title: string;
            description: string;
            price: string;
            rent_amount: string;
            rent_rate: string;
            category: string[];
            posted: string;
            userId: number;
        }
    ) {
        // const { title } = args;
        const product = await prisma.product.create({
            data: {
                title: args.title,
                description: args.description,
                price: Number(args.price),
                rent_amount: Number(args.rent_amount) || undefined,
                rent_rate: args.rent_rate || undefined,
                posted: new Date(args.posted),
                status: true,
                views: 0,
                userId: args.userId,
            },
        });
        const category_product = await prisma.category_Product.createMany({
            data: args.category.map((element) => ({
                productId: product.id,
                categoryId: Number(element),
            })),
        });
        const new_product = await prisma.product.findFirst({
            where: { id: product.id },
            include: {
                category_product: {
                    include: {
                        category: true,
                    },
                },
            },
        });
        return new_product;
    }

    async productUpdateMutation(
        _: any,
        args: {
            id: string;
            title: string;
            description: string;
            price: string;
            rent_amount: string;
            rent_rate: string;
            category: string[];
        }
    ) {
        await prisma.category_Product.deleteMany({
            where: {
                productId: Number(args.id),
            },
        });

        let newCategories: { productId: number; categoryId: number }[] = [];

        if (args.category && args.category.length > 0) {
            newCategories = args.category.map((element) => ({
                productId: Number(args.id),
                categoryId: Number(element),
            }));
        }

        await prisma.category_Product.createMany({
            data: newCategories,
        });

        const product = await prisma.product.update({
            where: {
                id: Number(args.id),
            },
            data: {
                title: args.title || undefined,
                description: args.description || undefined,
                price: Number(args.price) || undefined,
                rent_amount: Number(args.rent_amount) || undefined,
                rent_rate: args.rent_rate || undefined,
            },
            include: {
                category_product: {
                    include: {
                        category: true,
                    },
                },
            },
        });

        // console.log(product);

        return product;
    }

    async deleteProduct(_: any, args: { productId: number }) {
        const product = await prisma.product.update({
            where: {
                id: args.productId,
            },
            data: {
                status: false,
            },
        });
        return product;
    }
}

const Product = new _Product_();
export default Product;
