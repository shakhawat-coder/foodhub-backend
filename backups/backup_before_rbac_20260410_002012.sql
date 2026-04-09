--
-- PostgreSQL database dump
--

\restrict UgvCQGEdyriN9Vla4TVjke48p85UkJt29UrjI0795dpHDKXMLa61PQoTfHzSCrU

-- Dumped from database version 17.8 (a48d9ca)
-- Dumped by pg_dump version 18.1

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: neondb_owner
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO neondb_owner;

--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: neondb_owner
--

COMMENT ON SCHEMA public IS '';


--
-- Name: DIETSRYTYPE; Type: TYPE; Schema: public; Owner: neondb_owner
--

CREATE TYPE public."DIETSRYTYPE" AS ENUM (
    'FLEXITERISN',
    'HALAL',
    'VEGAN',
    'VEGETARIAN'
);


ALTER TYPE public."DIETSRYTYPE" OWNER TO neondb_owner;

--
-- Name: ORDERSTATUS; Type: TYPE; Schema: public; Owner: neondb_owner
--

CREATE TYPE public."ORDERSTATUS" AS ENUM (
    'PENDING',
    'PREPARING',
    'OUT_FOR_DELIVERY',
    'DELIVERED',
    'CANCELLED'
);


ALTER TYPE public."ORDERSTATUS" OWNER TO neondb_owner;

--
-- Name: ROLE; Type: TYPE; Schema: public; Owner: neondb_owner
--

CREATE TYPE public."ROLE" AS ENUM (
    'USER',
    'PROVIDER',
    'ADMIN'
);


ALTER TYPE public."ROLE" OWNER TO neondb_owner;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Banner; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public."Banner" (
    id text NOT NULL,
    images text[] DEFAULT ARRAY[]::text[],
    subheading text NOT NULL,
    heading text NOT NULL,
    "shortDescription" text NOT NULL,
    url text NOT NULL,
    priority integer DEFAULT 0 NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "buttonText" text DEFAULT 'Shop Now'::text NOT NULL
);


ALTER TABLE public."Banner" OWNER TO neondb_owner;

--
-- Name: Cart; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public."Cart" (
    id text NOT NULL,
    "userId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Cart" OWNER TO neondb_owner;

--
-- Name: CartItem; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public."CartItem" (
    id text NOT NULL,
    "cartId" text NOT NULL,
    "mealId" text NOT NULL,
    quantity integer DEFAULT 1 NOT NULL
);


ALTER TABLE public."CartItem" OWNER TO neondb_owner;

--
-- Name: Category; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public."Category" (
    id text NOT NULL,
    name text NOT NULL,
    image text NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL
);


ALTER TABLE public."Category" OWNER TO neondb_owner;

--
-- Name: Meal; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public."Meal" (
    id text NOT NULL,
    name text NOT NULL,
    image text,
    price double precision NOT NULL,
    description text NOT NULL,
    "providerId" text NOT NULL,
    "dietaryTypes" public."DIETSRYTYPE" DEFAULT 'HALAL'::public."DIETSRYTYPE" NOT NULL,
    "isPopular" boolean DEFAULT false NOT NULL,
    "categoryId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Meal" OWNER TO neondb_owner;

--
-- Name: OrderItem; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public."OrderItem" (
    id text NOT NULL,
    "orderId" text NOT NULL,
    "mealId" text NOT NULL,
    "providerId" text NOT NULL,
    quantity integer NOT NULL,
    price double precision NOT NULL
);


ALTER TABLE public."OrderItem" OWNER TO neondb_owner;

--
-- Name: Provider; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public."Provider" (
    id text NOT NULL,
    name text NOT NULL,
    logo text,
    address text NOT NULL,
    phone text NOT NULL,
    email text NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL
);


ALTER TABLE public."Provider" OWNER TO neondb_owner;

--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO neondb_owner;

--
-- Name: account; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.account (
    id text NOT NULL,
    "accountId" text NOT NULL,
    "providerId" text NOT NULL,
    "userId" text NOT NULL,
    "accessToken" text,
    "refreshToken" text,
    "idToken" text,
    "accessTokenExpiresAt" timestamp(3) without time zone,
    "refreshTokenExpiresAt" timestamp(3) without time zone,
    scope text,
    password text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.account OWNER TO neondb_owner;

--
-- Name: order; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public."order" (
    id text NOT NULL,
    "userId" text NOT NULL,
    status public."ORDERSTATUS" DEFAULT 'PENDING'::public."ORDERSTATUS" NOT NULL,
    "totalAmount" double precision NOT NULL,
    address text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."order" OWNER TO neondb_owner;

--
-- Name: review; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.review (
    id text NOT NULL,
    rating numeric(2,1) NOT NULL,
    comment text NOT NULL,
    "userId" text NOT NULL,
    "mealId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.review OWNER TO neondb_owner;

--
-- Name: session; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.session (
    id text NOT NULL,
    "expiresAt" timestamp(3) without time zone NOT NULL,
    token text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "ipAddress" text,
    "userAgent" text,
    "userId" text NOT NULL
);


ALTER TABLE public.session OWNER TO neondb_owner;

--
-- Name: user; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public."user" (
    id text NOT NULL,
    name text NOT NULL,
    email text NOT NULL,
    "emailVerified" boolean DEFAULT true NOT NULL,
    image text,
    role public."ROLE" DEFAULT 'USER'::public."ROLE" NOT NULL,
    phone text,
    address text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "isSuspended" boolean DEFAULT false NOT NULL
);


ALTER TABLE public."user" OWNER TO neondb_owner;

--
-- Name: verification; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.verification (
    id text NOT NULL,
    identifier text NOT NULL,
    value text NOT NULL,
    "expiresAt" timestamp(3) without time zone NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.verification OWNER TO neondb_owner;

--
-- Data for Name: Banner; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public."Banner" (id, images, subheading, heading, "shortDescription", url, priority, "isActive", "createdAt", "updatedAt", "buttonText") FROM stdin;
9724171c-ae87-499a-959e-06cb59faa40e	{https://res.cloudinary.com/deosirf4r/image/upload/v1775756061/uploads/gqgono2qo57scmsjrjhz.png}	The Ultimate Steakhouse Experience	Prime Sizzling Steaks	Experience the finest cuts of aged meat, grilled to perfection by our master chefs for a truly unforgettable meal.	https://foodhub-frontend-mu.vercel.app/meals/c76b4ebc-7139-467c-aa69-019b9cda0289	1	t	2026-04-09 17:34:29.023	2026-04-09 17:34:29.023	Order Now
89c1e076-baca-405b-bc5b-0b1a93d39199	{https://res.cloudinary.com/deosirf4r/image/upload/v1775756928/uploads/rye7rggy2ve4ivdqxepk.jpg}	Fresh, Hot & Delicious	Tasty Treats You’ll Love	Discover mouth-watering meals crafted with the finest ingredients and delivered straight to your doorstep. Taste the difference with every bite.	https://foodhub-frontend-mu.vercel.app/restaurants/073b9aff-e90f-4299-9393-32e37bdbf069	2	t	2026-04-09 17:48:57.347	2026-04-09 17:48:57.347	Visit Now
\.


--
-- Data for Name: Cart; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public."Cart" (id, "userId", "createdAt", "updatedAt") FROM stdin;
353c6783-e494-413c-b20f-7f237d16f59a	8t4EM3FT5T7eG1JcwrYKReQCtSAGuFIg	2026-02-01 06:26:18.535	2026-02-01 06:26:18.535
4cc74c54-dd9c-4cfb-bac8-629814d3df0c	83hXzQSnNpCvw1qnJaxh67RyuZVcMf0k	2026-02-01 15:54:18.506	2026-02-01 15:54:18.506
6cdb62b5-bf58-46e4-864b-d9c8289a787d	iSQ6SMi0TWAnPmPOLl36M9gCzV3L0gl9	2026-02-02 13:08:44.44	2026-02-02 13:08:44.44
4e17c3af-2e94-481d-9e6f-d22b72caaaa3	896hb9fI4Xpmlx9Ybm763B0q4AFpVHPe	2026-02-02 17:08:24.692	2026-02-02 17:08:24.692
\.


--
-- Data for Name: CartItem; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public."CartItem" (id, "cartId", "mealId", quantity) FROM stdin;
b7457ce0-dc9f-45d2-895c-3b6e45166268	4cc74c54-dd9c-4cfb-bac8-629814d3df0c	2e79d4cb-a478-4829-9f63-fb0540b33c27	1
\.


--
-- Data for Name: Category; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public."Category" (id, name, image, "isActive") FROM stdin;
7c3cd6d5-d00c-429d-a601-79e257dfe5e7	Fast Food	https://images.unsplash.com/photo-1512152272829-e3139592d56f?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZmFzdCUyMGZvb2R8ZW58MHwwfDB8fHww	t
89c33a62-fe23-4800-9438-fda564b4e8f9	Chinese Food	https://images.unsplash.com/photo-1707013533606-62919aa3aa29?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8Y2hpbmVzZSUyMGZvb2R8ZW58MHwwfDB8fHww	t
c38cc848-afbd-4cf9-ad49-090e4bfafce8	Dessert	https://images.unsplash.com/photo-1587314168485-3236d6710814?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZGVzc2VydHxlbnwwfDB8MHx8fDA%3D	t
cacfef75-0069-425c-827b-1c3be3d6f112	Biriani	https://res.cloudinary.com/deosirf4r/image/upload/foodhub/admin/b704-biriani	t
1115e856-23aa-4ef9-b903-a6d2b022c0a9	Steak	https://res.cloudinary.com/deosirf4r/image/upload/v1770009003/foodhub/admin/1770008993454-banner1.png	t
d51e384b-e222-45c6-85c6-88bba8bc1b0e	Indian Food	https://res.cloudinary.com/deosirf4r/image/upload/v1770026415/uploads/blrokmgvhatpdjsjlkw3.jpg	t
af26da7a-1f56-4882-a8c7-626ea15b77f9	Snacks	https://res.cloudinary.com/deosirf4r/image/upload/v1770029910/uploads/pqw4gevwlujpwcbsvnql.avif	t
\.


--
-- Data for Name: Meal; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public."Meal" (id, name, image, price, description, "providerId", "dietaryTypes", "isPopular", "categoryId", "createdAt", "updatedAt") FROM stdin;
2e79d4cb-a478-4829-9f63-fb0540b33c27	Watermelon Juice	https://res.cloudinary.com/deosirf4r/image/upload/foodhub/juice/d457-watermelon	20	Best watermelon juice 	52d7f76f-19f7-4527-b7ed-a2c1a8f0291e	VEGETARIAN	t	c38cc848-afbd-4cf9-ad49-090e4bfafce8	2026-02-02 00:53:11.789	2026-02-02 00:53:11.789
c76b4ebc-7139-467c-aa69-019b9cda0289	Steak	https://res.cloudinary.com/deosirf4r/image/upload/v1770009960/foodhub/tasty/1770009937366-banner1.png	150	boiled steak 	073b9aff-e90f-4299-9393-32e37bdbf069	HALAL	t	1115e856-23aa-4ef9-b903-a6d2b022c0a9	2026-02-02 05:26:22.371	2026-02-02 05:26:22.371
55a83853-675e-439c-bba3-3147161b6468	cake	https://images.unsplash.com/photo-1611293388250-580b08c4a145?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8c3RyYXdiZXJyeSUyMGNha2V8ZW58MHwwfDB8fHww	400	Strawberry cace	073b9aff-e90f-4299-9393-32e37bdbf069	HALAL	t	c38cc848-afbd-4cf9-ad49-090e4bfafce8	2026-02-01 06:08:43.51	2026-02-02 05:47:46.655
145e3d33-6dde-47c4-8219-3740010a1d96	 Ice-cream	https://images.unsplash.com/photo-1501443762994-82bd5dace89a?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8aWNlJTIwY3JlYW18ZW58MHwwfDB8fHww	139.99	Vanilla Ice-cream 	073b9aff-e90f-4299-9393-32e37bdbf069	HALAL	f	c38cc848-afbd-4cf9-ad49-090e4bfafce8	2026-02-01 06:07:48.832	2026-02-02 11:22:21.205
0eb8629f-942e-404c-8983-dff728a7fbbb	Burger	https://res.cloudinary.com/deosirf4r/image/upload/v1770033280/uploads/emfo7m7nhvthd30bssnv.jpg	120	Chicken Burger 	52d7f76f-19f7-4527-b7ed-a2c1a8f0291e	HALAL	f	7c3cd6d5-d00c-429d-a601-79e257dfe5e7	2026-02-02 11:54:47.416	2026-02-02 11:54:47.416
0f60d9ae-3323-49c1-abc9-7df47e5bcc7c	Cheez Burger	https://res.cloudinary.com/deosirf4r/image/upload/v1770033404/uploads/paymtyynwbllm0pevhdf.avif	220	Classic Cheese Burger	52d7f76f-19f7-4527-b7ed-a2c1a8f0291e	HALAL	f	7c3cd6d5-d00c-429d-a601-79e257dfe5e7	2026-02-02 11:56:51.254	2026-02-02 11:57:19.81
07cd309b-ab38-4ecb-84fd-6a6cb7022b6a	Naga Chicken	https://res.cloudinary.com/deosirf4r/image/upload/v1770040530/uploads/bjdjywxlruxzvlz6lwe7.jpg	30	Full Spicy	350853cb-ffae-4f70-9bd0-a3b374cb66cb	HALAL	t	1115e856-23aa-4ef9-b903-a6d2b022c0a9	2026-02-02 13:56:00	2026-02-02 13:56:00
\.


--
-- Data for Name: OrderItem; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public."OrderItem" (id, "orderId", "mealId", "providerId", quantity, price) FROM stdin;
5098d2e7-64ed-43e2-899e-49245930920d	31ec67c3-9f0a-4f43-ad85-a364d953babc	55a83853-675e-439c-bba3-3147161b6468	073b9aff-e90f-4299-9393-32e37bdbf069	1	400
7b415194-bff8-40d3-9eb4-e33d3f31f085	343ed2ef-608a-4b41-825f-16f5e693dbb3	145e3d33-6dde-47c4-8219-3740010a1d96	073b9aff-e90f-4299-9393-32e37bdbf069	1	150
c81b458e-a9f5-43fd-9e72-2bb8df534999	60959cff-253f-40a2-a652-65223a7c45a8	55a83853-675e-439c-bba3-3147161b6468	073b9aff-e90f-4299-9393-32e37bdbf069	1	400
2eafbc89-7d36-412c-b8ba-691a42ffa55d	60959cff-253f-40a2-a652-65223a7c45a8	2e79d4cb-a478-4829-9f63-fb0540b33c27	52d7f76f-19f7-4527-b7ed-a2c1a8f0291e	2	20
e2332131-642c-4578-9663-fb56e65561f0	7d5b6365-944d-4396-b3e2-cc4dc52497e9	2e79d4cb-a478-4829-9f63-fb0540b33c27	52d7f76f-19f7-4527-b7ed-a2c1a8f0291e	1	20
35c08443-73af-4f27-836d-af8ec3a861e2	8d5e2b41-34cf-49be-8f09-acc3cd006904	55a83853-675e-439c-bba3-3147161b6468	073b9aff-e90f-4299-9393-32e37bdbf069	1	400
1c79202c-4121-4fa2-8614-73f028f1d1d2	2cd59033-4850-4e4f-a922-2c0d4f23d521	c76b4ebc-7139-467c-aa69-019b9cda0289	073b9aff-e90f-4299-9393-32e37bdbf069	2	150
411921d2-aa7a-4408-8cb2-16a3ac91d18c	9f6fd2ea-2062-422d-b308-e01f4746eb18	0eb8629f-942e-404c-8983-dff728a7fbbb	52d7f76f-19f7-4527-b7ed-a2c1a8f0291e	2	120
ebba4101-466a-4856-86ef-8cf422c74149	d9cd07ef-2ae9-4454-9c59-88a9c65adcb3	c76b4ebc-7139-467c-aa69-019b9cda0289	073b9aff-e90f-4299-9393-32e37bdbf069	2	150
3c1f0b44-9622-42b1-bcbe-f2b0ca869bfa	371c6a2b-6206-477b-a076-db81ff73aa16	145e3d33-6dde-47c4-8219-3740010a1d96	073b9aff-e90f-4299-9393-32e37bdbf069	2	139.99
\.


--
-- Data for Name: Provider; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public."Provider" (id, name, logo, address, phone, email, "isActive") FROM stdin;
e34319b4-744b-429a-a8ad-398b32c25e04	Mithai	\N	Dhaka	01712345678	shamim3@gmail.com	t
073b9aff-e90f-4299-9393-32e37bdbf069	Tasty Treat	https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS2_3DCTRPVFczWlhsOtNpx1IS9d-ueqzGZeQ&s	Dhaka	01780551403	shamim1@gmail.com	t
52d7f76f-19f7-4527-b7ed-a2c1a8f0291e	Juice Corner	https://res.cloudinary.com/deosirf4r/image/upload/foodhub/juice/414b-juicelogo	Dhaka	1780551403	shamim2@gmail.com	t
350853cb-ffae-4f70-9bd0-a3b374cb66cb	The Spicy	https://res.cloudinary.com/deosirf4r/image/upload/v1770039833/uploads/ldegflo8guzoecxjf6dy.jpg	Dhaka Bangladesh	01780551403	shamim7@gmail.com	t
4240dff3-c1e3-4402-aeab-0c593e45de92	Tasty Food	\N	Dhaka	01787676575	tastyfood@gmail.com	t
\.


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
71eff3c0-a92d-49bf-ad67-58d50be18977	99646dc3d518e106aaa7bea5d44505cdaa2ce9dbca14ce32f0a43863f4f296b9	2026-02-01 04:27:39.093911+00	20260130064911_order	\N	\N	2026-02-01 04:27:37.564512+00	1
19e3e27f-ae03-447e-ac8b-d2b65f709186	6e9be093dba8e1e5ee2b05d384cf8dfa2d8503b3b9b5fbb043589aa22feadc92	2026-02-01 04:31:13.231058+00	20260201043110_add_review	\N	\N	2026-02-01 04:31:11.695357+00	1
a2b9ffc3-c2fa-4277-b0cf-21a47f6de05f	2f04f2d300c94acacd914626f131a29a17b93e2640253877ea7cba7d661f7a3a	2026-02-02 13:26:12.897652+00	20260202132610_set_email_verified_default_true	\N	\N	2026-02-02 13:26:11.484632+00	1
7755244d-9a36-4bf8-8537-e3cdb586ba2d	4f369d15ad119bacb7add951a70e2d51767b7f7fe2740738b3722a7d3f2de0e9	2026-04-09 17:01:57.653746+00	20260409170154_banner	\N	\N	2026-04-09 17:01:55.998405+00	1
6314be39-3750-4d2e-81c0-7747d6f565d4	3bb53df9dd209980e518f36d01120e799e24b8a761da0f3bf5f201a44c7f1f80	2026-04-09 17:30:13.557792+00	20260409173010_add_button_text_to_banner	\N	\N	2026-04-09 17:30:11.977459+00	1
\.


--
-- Data for Name: account; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.account (id, "accountId", "providerId", "userId", "accessToken", "refreshToken", "idToken", "accessTokenExpiresAt", "refreshTokenExpiresAt", scope, password, "createdAt", "updatedAt") FROM stdin;
GqiT7MpCv5iRIQjAhA6KbeALCk1qkyUU	ElpipO0pvveJghLI0TXVXdTxAAjSAfRn	credential	ElpipO0pvveJghLI0TXVXdTxAAjSAfRn	\N	\N	\N	\N	\N	\N	96aad19116b4caa7139e63c7e2d76c8c:aeaaeb7536777de58e113fcb3663ada97c3a6576a239e0f22b07420bacbaa2ec1203276eee91235627dbbc8824f7f069aff17fcdc97c6b36edc70cebe872794f	2026-02-01 04:33:04.346	2026-02-01 04:33:04.346
Qf52hpjSHG8kPBGmxEqt9Ci1m52ZHShQ	agKG5fsXY7dgjuU32irg8gPC12YMTXLe	credential	agKG5fsXY7dgjuU32irg8gPC12YMTXLe	\N	\N	\N	\N	\N	\N	ba43a4bbe8cc9aa773f848a5fdad488d:f138426a22b5cfe85719df0ef53b9c1aa63fb91a46d4a25b2cc789288c819a694efdd17adaccb984243a0861307b1f2a7440478e75701953b8240508961b424b	2026-02-01 05:43:46.43	2026-02-01 05:43:46.43
Rzz9GiWtfFj7dcNkQqAec14LawwwGRyh	cm4nSacr0vYJ5V7fa1aOoOxVvoqTfgsF	credential	cm4nSacr0vYJ5V7fa1aOoOxVvoqTfgsF	\N	\N	\N	\N	\N	\N	0bc1dd03062c4d039a54d95cec90fc13:24e0b51d2a186a05a217210325e8f0d2d57cf05736dd8fe7c603e55bae3dcf0e1c87b17d3a8682e04c80a726d02349e6ab8a2937419d97db24eb6932bbde8210	2026-02-01 05:44:32.918	2026-02-01 05:44:32.918
JhsTC8FStGccKLPL0Wm1x6fNX7w69K8q	8Gsv6qhMbhcFmFpvXFhBVUIDBq5QfEQT	credential	8Gsv6qhMbhcFmFpvXFhBVUIDBq5QfEQT	\N	\N	\N	\N	\N	\N	0732d3c64e8c11b14bc21d016a90b78c:35f7f9df340fbdbed3880e8c34a6917eefaf2e0410cfdd275d85ebc81e0b1f0304f85b4b82d8a8346f75cfd81fadedbd6056e4e0fc13216798a34a247d452c9a	2026-02-01 05:45:21.048	2026-02-01 05:45:21.048
BovZeHEc0RcSqHoCwp1IcCsdM16fqxAK	8t4EM3FT5T7eG1JcwrYKReQCtSAGuFIg	credential	8t4EM3FT5T7eG1JcwrYKReQCtSAGuFIg	\N	\N	\N	\N	\N	\N	6f71839168bb9a7238bfd42aab4361ee:90d3b61741c0a518cdfe3aeb22465ac057673ba5cb53f2da3b4b090491b128263304ced564ac0eec643115f307a4038f58e77126c0831a08d847d96887d36301	2026-02-01 05:45:42.654	2026-02-01 05:45:42.654
ofcCMT0TGKZOJuDInN8KKs8Dz9pIUbHn	83hXzQSnNpCvw1qnJaxh67RyuZVcMf0k	credential	83hXzQSnNpCvw1qnJaxh67RyuZVcMf0k	\N	\N	\N	\N	\N	\N	3fcbc579e9f9d9fe218f299f9ca396e6:1a7426a9519e08c85aba86fe9d9bddc21828e3383a6c262e08f4656455de1d4dd47b5435cccb84c9e3df529343141d47f9848714800c2e1df7915c5252e4555d	2026-02-01 05:46:07.536	2026-02-01 05:46:07.536
456v0E2XO9VJfccCBKBCdG7Izr6uZBj7	LNbZAWIMdMH9BLsUl8d7xeQ7h5GHbD7g	credential	LNbZAWIMdMH9BLsUl8d7xeQ7h5GHbD7g	\N	\N	\N	\N	\N	\N	25f524e9ab80dd17c394eda62503970e:5882c3b75f314b188f2d483cf6251ecfe07865c8294376bbe00f0d5145b1a3a6002330a88c1cbf191c4855376bf82f445e833a5a9e2c1139b66cb57b2020292d	2026-02-01 05:46:37.233	2026-02-01 05:46:37.233
JrnBYcA65VzB5vCyLKLNFx2vx5xLzZKU	iSQ6SMi0TWAnPmPOLl36M9gCzV3L0gl9	credential	iSQ6SMi0TWAnPmPOLl36M9gCzV3L0gl9	\N	\N	\N	\N	\N	\N	b6f0a27f8643fa9b6ba48a20df36e548:aea8149c66ee79df6132ca82db568355995f40f742dc3cff639d2f29acd7f3d8cb4933e20639d89100eeece581ce1d2d645b83b154c6ddfdf3071e147b9a6714	2026-02-02 13:04:49.057	2026-02-02 13:04:49.057
bbQbAn1cBK9cZU4LkAqwKnwIBuQX3Q2O	0e3xZlIBNHipXfvBcI7X0vBFqMtPVJmw	credential	0e3xZlIBNHipXfvBcI7X0vBFqMtPVJmw	\N	\N	\N	\N	\N	\N	014fe66c588049706f4ef157ff4c66ec:393e19cee68d4c8752c73c1e63b6b6b165999935986cd1bd1b1e419aa5d48383cc2d414053f6e08588154c297c06fd9b5ce05abf1323c987d75023e9d345ca6f	2026-02-02 13:34:40.384	2026-02-02 13:34:40.384
fQQBrvmiZEJCCogkiSCej2k2epVXbEI3	MUd9TOQnmpuYYDvgf25SpJ2mylb0ClNo	credential	MUd9TOQnmpuYYDvgf25SpJ2mylb0ClNo	\N	\N	\N	\N	\N	\N	185a3bd1b889f5c71edbf6b92aba3f7d:7ea0df7782f691f1153ed1f29ad39f62c1dafb6851248611d678087f2a86b4e655c973f509c7d05514dd74034e2182a4e27d4da6c1616df680a81a935bf98bc8	2026-02-02 15:56:12.112	2026-02-02 15:56:12.112
KWzHNEWHBqZDUAQEGILLwv1VBANqZeJo	896hb9fI4Xpmlx9Ybm763B0q4AFpVHPe	credential	896hb9fI4Xpmlx9Ybm763B0q4AFpVHPe	\N	\N	\N	\N	\N	\N	95bb0f18d0035ba044481a891a89ac19:67ec3767bee3fc0fad92dd5a7a50467aed03b04136ae79c5e362f63ce35716d795a4c5b1efccfa84dd4225c89af2c00b09f88d629cac275b7648cc82ba57a84f	2026-02-02 17:08:10.05	2026-02-02 17:08:10.05
Wnx3636Ys9X6R8PBGPC57e3XpJ5xqRhz	H092P6toyelfqSNfd2d4lNwemQddUXKY	credential	H092P6toyelfqSNfd2d4lNwemQddUXKY	\N	\N	\N	\N	\N	\N	75214ee3e30b68abaa65eb53dccc70e1:2ba1f31d68285475c33353b4888f964c07f9d1e001e2679b079446545cb37c4de24d1140c5a1bb3221b3ec01c11379531ae6a1ff411eec86017b29655738ed38	2026-02-17 09:40:44.804	2026-02-17 09:40:44.804
\.


--
-- Data for Name: order; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public."order" (id, "userId", status, "totalAmount", address, "createdAt", "updatedAt") FROM stdin;
31ec67c3-9f0a-4f43-ad85-a364d953babc	8t4EM3FT5T7eG1JcwrYKReQCtSAGuFIg	DELIVERED	400	Bethany Golden, Molestiae quia minim, Consequatur voluptat, Ad minus error dolor, Error temporibus est, PH: +1 (753) 426-9947	2026-02-01 06:28:00.152	2026-02-01 06:28:00.152
343ed2ef-608a-4b41-825f-16f5e693dbb3	8t4EM3FT5T7eG1JcwrYKReQCtSAGuFIg	DELIVERED	150	Keelie Sharp, Dicta excepteur ea e, Non ex dolor unde of, Sint eum sint tempor, Eum ad laboriosam e, PH: +1 (529) 911-8845	2026-02-01 07:23:23.285	2026-02-01 07:23:23.285
7d5b6365-944d-4396-b3e2-cc4dc52497e9	83hXzQSnNpCvw1qnJaxh67RyuZVcMf0k	DELIVERED	20	Shamim , Address: Dhaka, PH: 01780551403	2026-02-02 01:58:15.832	2026-02-02 01:58:15.832
8d5e2b41-34cf-49be-8f09-acc3cd006904	83hXzQSnNpCvw1qnJaxh67RyuZVcMf0k	DELIVERED	400	Shamim , Address: Dhaka, PH: 01780551403	2026-02-02 02:01:07.612	2026-02-02 05:26:39.195
60959cff-253f-40a2-a652-65223a7c45a8	83hXzQSnNpCvw1qnJaxh67RyuZVcMf0k	CANCELLED	440	Shamim , Address: Dhaka, PH: 01780551403	2026-02-02 01:56:12.695	2026-02-02 05:32:00.369
d9cd07ef-2ae9-4454-9c59-88a9c65adcb3	iSQ6SMi0TWAnPmPOLl36M9gCzV3L0gl9	DELIVERED	300	Arko , Address: Abcd, PH: 123543543	2026-02-02 13:11:07.749	2026-02-02 13:13:29.293
2cd59033-4850-4e4f-a922-2c0d4f23d521	83hXzQSnNpCvw1qnJaxh67RyuZVcMf0k	DELIVERED	300	Shamim , Address: Dhaka, PH: 01780551403	2026-02-02 05:29:37.905	2026-02-02 13:13:38.073
371c6a2b-6206-477b-a076-db81ff73aa16	896hb9fI4Xpmlx9Ybm763B0q4AFpVHPe	PENDING	279.98	shamim , Address: Dhaka, PH: 01744589765	2026-02-02 17:09:12.989	2026-02-02 17:09:12.989
9f6fd2ea-2062-422d-b308-e01f4746eb18	8t4EM3FT5T7eG1JcwrYKReQCtSAGuFIg	OUT_FOR_DELIVERY	240	shakhawat , Address: Dhaka,Bangladesh, PH: 01712345678	2026-02-02 12:06:37.41	2026-02-04 06:11:03.194
\.


--
-- Data for Name: review; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.review (id, rating, comment, "userId", "mealId", "createdAt", "updatedAt") FROM stdin;
1cc6b573-4c55-4bf8-9f0b-d2116006298a	5.0	Yammy 	8t4EM3FT5T7eG1JcwrYKReQCtSAGuFIg	55a83853-675e-439c-bba3-3147161b6468	2026-02-01 06:14:20.513	2026-02-01 06:14:20.513
2ebd039a-aace-4e2a-948e-a2fbea6fef84	4.0	Very Cold	8t4EM3FT5T7eG1JcwrYKReQCtSAGuFIg	145e3d33-6dde-47c4-8219-3740010a1d96	2026-02-01 07:25:12.977	2026-02-01 07:25:12.977
082b519b-4665-4583-866e-4f532a17f9fa	5.0	Delicious. But the treat has to be in real life. 	iSQ6SMi0TWAnPmPOLl36M9gCzV3L0gl9	c76b4ebc-7139-467c-aa69-019b9cda0289	2026-02-02 13:19:02.372	2026-02-02 13:19:02.372
\.


--
-- Data for Name: session; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.session (id, "expiresAt", token, "createdAt", "updatedAt", "ipAddress", "userAgent", "userId") FROM stdin;
CKu8DHN0i4AFTBZwfudTp1LUL4NvtwUO	2026-02-08 04:33:04.653	vF0YbOtzXqPrggYlBLuhm3JZmwxJktJt	2026-02-01 04:33:04.653	2026-02-01 04:33:04.653		node	ElpipO0pvveJghLI0TXVXdTxAAjSAfRn
Xa0AROLQyExSpoO4U1O5evPbJYOsxy6q	2026-02-08 05:43:46.739	Rg8ae0HOtibheWBGT1Yfeh2BnikPkiiG	2026-02-01 05:43:46.739	2026-02-01 05:43:46.739		Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36	agKG5fsXY7dgjuU32irg8gPC12YMTXLe
u9ed4gL0ExuisB2da9ZO9ZtU0tjXzt2I	2026-02-08 05:44:33.226	4SU9KcmkmN928rHzF591EslRTQzTjrtg	2026-02-01 05:44:33.226	2026-02-01 05:44:33.226		Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36	cm4nSacr0vYJ5V7fa1aOoOxVvoqTfgsF
UkfmXEHGYJh1r1Yphu1roH7aycGxcnkp	2026-02-08 05:45:21.355	u5RqiswCgcEf9Lsu60faBNTXiBtrClFX	2026-02-01 05:45:21.355	2026-02-01 05:45:21.355		Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36	8Gsv6qhMbhcFmFpvXFhBVUIDBq5QfEQT
T6TXl59ZTGtxexqGKwtFHFew1MTi9w9v	2026-02-08 05:45:42.961	D4LBy2CiT79RDwiUCYt1mZkYtYYcvA8t	2026-02-01 05:45:42.961	2026-02-01 05:45:42.961		Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36	8t4EM3FT5T7eG1JcwrYKReQCtSAGuFIg
p3RJ3Eep49FkiuXqyv10AHA2cDH0wdpo	2026-02-08 05:46:07.843	nBvAxi0m19oQweySdCqMldc6J1TCbykE	2026-02-01 05:46:07.843	2026-02-01 05:46:07.843		Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36	83hXzQSnNpCvw1qnJaxh67RyuZVcMf0k
bXgzEv8uLFgDZuLk09TvppF8fF1aoYgM	2026-02-24 09:40:44.823	vrmk9XinmpNGC5DfDDmNM7Iefk30kCKC	2026-02-17 09:40:44.823	2026-02-17 09:40:44.823	114.129.14.178	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36	H092P6toyelfqSNfd2d4lNwemQddUXKY
gn2h0YnNdztxaMK2SW2wx0z0CDSCv8BI	2026-02-25 13:07:56.105	HdOmCFhhBAhpOZWXm1oCdJ7IsUIrj78r	2026-02-10 11:24:06.901	2026-02-18 13:07:56.105	103.180.206.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36	ElpipO0pvveJghLI0TXVXdTxAAjSAfRn
NwytOB2TR9cT9JyFg3WFt7taTwaaW7PD	2026-04-16 17:14:57.295	rKx3lCMI11PkJ7J4ZiqtyTCluBY8ukdh	2026-04-09 17:14:57.296	2026-04-09 17:14:57.296	103.180.206.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36	ElpipO0pvveJghLI0TXVXdTxAAjSAfRn
VQuKCQpurFs7nwk1KOTMgO7li2Br4Bv5	2026-02-09 05:14:33.724	tm8vNLVeF3e1B5S1Urv9wxGh4gEmeSsZ	2026-02-02 05:14:33.724	2026-02-02 05:14:33.724		Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36	agKG5fsXY7dgjuU32irg8gPC12YMTXLe
L7hcRMzSXlbsW91hQVzhbtmmKbFB2Y8N	2026-02-09 06:49:56.493	HCJFN9UFByxDsHvDYWBVvETQWRW87BY1	2026-02-02 06:49:56.493	2026-02-02 06:49:56.493		Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36	agKG5fsXY7dgjuU32irg8gPC12YMTXLe
BjIrgIKE1pqBsXHwsM70cyPsJMb9Wq71	2026-02-09 13:43:07.311	X3gnUcQNpJGCd5h02p23tBICOaGLZ7nq	2026-02-02 13:43:07.311	2026-02-02 13:43:07.311	103.180.206.3	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0	0e3xZlIBNHipXfvBcI7X0vBFqMtPVJmw
U17FmTWM1We7EFBS64brHnbYRozH8x20	2026-02-11 06:18:55.594	1DGSmfzoJJWGU6hQ5F9WMGnEweniz4Qn	2026-02-02 13:04:49.114	2026-02-04 06:18:55.594	45.250.229.151	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36	iSQ6SMi0TWAnPmPOLl36M9gCzV3L0gl9
\.


--
-- Data for Name: user; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public."user" (id, name, email, "emailVerified", image, role, phone, address, "createdAt", "updatedAt", "isSuspended") FROM stdin;
ElpipO0pvveJghLI0TXVXdTxAAjSAfRn	Admin	admin@example.com	t	\N	ADMIN	\N	\N	2026-02-01 04:33:03.989	2026-02-01 04:33:03.989	f
896hb9fI4Xpmlx9Ybm763B0q4AFpVHPe	shamim	shamim11@gmail.com	t	\N	USER	\N	\N	2026-02-02 17:08:09.98	2026-02-02 17:08:09.98	f
8t4EM3FT5T7eG1JcwrYKReQCtSAGuFIg	shakhawat	shamim4@gmail.com	t		USER	+1 (529) 911-8845	Keelie Sharp, Dicta excepteur ea e, Non ex dolor unde of, Sint eum sint tempor, Eum ad laboriosam e, PH: +1 (529) 911-8845	2026-02-01 05:45:42.275	2026-02-05 12:09:06.363	f
H092P6toyelfqSNfd2d4lNwemQddUXKY	test	abc@abc.com	t	\N	PROVIDER	01700000000	hgfhfh	2026-02-17 09:40:44.781	2026-02-17 09:40:44.781	f
cm4nSacr0vYJ5V7fa1aOoOxVvoqTfgsF	Juice Corner	shamim2@gmail.com	t	\N	PROVIDER	1780551403	Dhaka	2026-02-01 05:44:32.605	2026-02-01 05:44:32.605	f
8Gsv6qhMbhcFmFpvXFhBVUIDBq5QfEQT	Mithai	shamim3@gmail.com	t	\N	PROVIDER	01712345678	Dhaka	2026-02-01 05:45:19.958	2026-02-01 06:00:06.294	f
iSQ6SMi0TWAnPmPOLl36M9gCzV3L0gl9	Arko	arko@gmail.com	t	\N	USER	123543543	Arko , Address: Abcd, PH: 123543543	2026-02-02 13:04:49.042	2026-02-02 13:13:41.566	f
0e3xZlIBNHipXfvBcI7X0vBFqMtPVJmw	The Spicy	shamim7@gmail.com	t	\N	PROVIDER	01780551403	Dhaka Bangladesh	2026-02-02 13:34:40.375	2026-02-02 13:34:40.375	f
MUd9TOQnmpuYYDvgf25SpJ2mylb0ClNo	Tasty Food	tastyfood@gmail.com	t	\N	PROVIDER	01787676575	Dhaka	2026-02-02 15:56:12.106	2026-02-02 15:56:12.106	f
LNbZAWIMdMH9BLsUl8d7xeQ7h5GHbD7g	Arko	shamim6@gmail.com	t	\N	USER	\N	\N	2026-02-01 05:46:36.828	2026-02-02 16:10:37.405	f
83hXzQSnNpCvw1qnJaxh67RyuZVcMf0k	Shamim	shamim5@gmail.com	t	\N	USER	01780551403	Dhaka	2026-02-01 05:46:07.147	2026-02-02 16:10:40.286	f
agKG5fsXY7dgjuU32irg8gPC12YMTXLe	Tasty Treat	shamim1@gmail.com	t	\N	PROVIDER	01780551403	Dhaka	2026-02-01 05:43:46.061	2026-02-02 16:17:49.127	t
\.


--
-- Data for Name: verification; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.verification (id, identifier, value, "expiresAt", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Name: Banner Banner_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."Banner"
    ADD CONSTRAINT "Banner_pkey" PRIMARY KEY (id);


--
-- Name: CartItem CartItem_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."CartItem"
    ADD CONSTRAINT "CartItem_pkey" PRIMARY KEY (id);


--
-- Name: Cart Cart_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."Cart"
    ADD CONSTRAINT "Cart_pkey" PRIMARY KEY (id);


--
-- Name: Category Category_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."Category"
    ADD CONSTRAINT "Category_pkey" PRIMARY KEY (id);


--
-- Name: Meal Meal_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."Meal"
    ADD CONSTRAINT "Meal_pkey" PRIMARY KEY (id);


--
-- Name: OrderItem OrderItem_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."OrderItem"
    ADD CONSTRAINT "OrderItem_pkey" PRIMARY KEY (id);


--
-- Name: Provider Provider_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."Provider"
    ADD CONSTRAINT "Provider_pkey" PRIMARY KEY (id);


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: account account_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.account
    ADD CONSTRAINT account_pkey PRIMARY KEY (id);


--
-- Name: order order_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."order"
    ADD CONSTRAINT order_pkey PRIMARY KEY (id);


--
-- Name: review review_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.review
    ADD CONSTRAINT review_pkey PRIMARY KEY (id);


--
-- Name: session session_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.session
    ADD CONSTRAINT session_pkey PRIMARY KEY (id);


--
-- Name: user user_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_pkey PRIMARY KEY (id);


--
-- Name: verification verification_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.verification
    ADD CONSTRAINT verification_pkey PRIMARY KEY (id);


--
-- Name: CartItem_cartId_mealId_key; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE UNIQUE INDEX "CartItem_cartId_mealId_key" ON public."CartItem" USING btree ("cartId", "mealId");


--
-- Name: Cart_userId_key; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE UNIQUE INDEX "Cart_userId_key" ON public."Cart" USING btree ("userId");


--
-- Name: Category_name_key; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE UNIQUE INDEX "Category_name_key" ON public."Category" USING btree (name);


--
-- Name: OrderItem_providerId_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "OrderItem_providerId_idx" ON public."OrderItem" USING btree ("providerId");


--
-- Name: Provider_email_key; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE UNIQUE INDEX "Provider_email_key" ON public."Provider" USING btree (email);


--
-- Name: account_userId_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "account_userId_idx" ON public.account USING btree ("userId");


--
-- Name: order_userId_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "order_userId_idx" ON public."order" USING btree ("userId");


--
-- Name: review_mealId_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "review_mealId_idx" ON public.review USING btree ("mealId");


--
-- Name: review_userId_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "review_userId_idx" ON public.review USING btree ("userId");


--
-- Name: session_token_key; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE UNIQUE INDEX session_token_key ON public.session USING btree (token);


--
-- Name: session_userId_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "session_userId_idx" ON public.session USING btree ("userId");


--
-- Name: user_email_key; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE UNIQUE INDEX user_email_key ON public."user" USING btree (email);


--
-- Name: verification_identifier_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX verification_identifier_idx ON public.verification USING btree (identifier);


--
-- Name: CartItem CartItem_cartId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."CartItem"
    ADD CONSTRAINT "CartItem_cartId_fkey" FOREIGN KEY ("cartId") REFERENCES public."Cart"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: CartItem CartItem_mealId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."CartItem"
    ADD CONSTRAINT "CartItem_mealId_fkey" FOREIGN KEY ("mealId") REFERENCES public."Meal"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Meal Meal_categoryId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."Meal"
    ADD CONSTRAINT "Meal_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES public."Category"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Meal Meal_providerId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."Meal"
    ADD CONSTRAINT "Meal_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES public."Provider"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: OrderItem OrderItem_mealId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."OrderItem"
    ADD CONSTRAINT "OrderItem_mealId_fkey" FOREIGN KEY ("mealId") REFERENCES public."Meal"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: OrderItem OrderItem_orderId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."OrderItem"
    ADD CONSTRAINT "OrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES public."order"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: account account_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.account
    ADD CONSTRAINT "account_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."user"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: order order_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."order"
    ADD CONSTRAINT "order_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."user"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: review review_mealId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.review
    ADD CONSTRAINT "review_mealId_fkey" FOREIGN KEY ("mealId") REFERENCES public."Meal"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: review review_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.review
    ADD CONSTRAINT "review_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."user"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: session session_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.session
    ADD CONSTRAINT "session_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."user"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: neondb_owner
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: cloud_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE cloud_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO neon_superuser WITH GRANT OPTION;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: cloud_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE cloud_admin IN SCHEMA public GRANT ALL ON TABLES TO neon_superuser WITH GRANT OPTION;


--
-- PostgreSQL database dump complete
--

\unrestrict UgvCQGEdyriN9Vla4TVjke48p85UkJt29UrjI0795dpHDKXMLa61PQoTfHzSCrU

