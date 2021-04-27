# Strapi application

To run server type the following in the terminal:

```
strapi develop
```

or

```
npm develop
```

Then, open the following url:
```
http://localhost:1337/
```

## Database Structure

### Category

Stores the category titles for the submenus

* Name (Text)
* Description (Text)
* Image (Media)
* Foods Relation  (Category belongs to many Foods) 

### Food

Stores info about the various food items you can order

* Name (Text)
* Description (Text)
* Image (Media)
* Price (Number)
* Category Relation  (Category has many Foods/ Many-to-one)  

### Order

Stores a copy of the orders before it is send to the Stripe API

* Address (Text)
* PostalCode (Text)
* City (Text)
* Foods (JSON)
* Amount (Number)
