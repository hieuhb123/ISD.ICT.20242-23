--
-- PostgreSQL database dump
--

-- Dumped from database version 17.2
-- Dumped by pg_dump version 17.2

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
-- Name: product_type_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.product_type_enum AS ENUM (
    'DVD',
    'CD',
    'Book'
);


ALTER TYPE public.product_type_enum OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: book; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.book (
    product_id integer NOT NULL,
    author character varying(255),
    publisher character varying(255),
    page_count integer
);


ALTER TABLE public.book OWNER TO postgres;

--
-- Name: cartitem; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cartitem (
    cart_item_id integer NOT NULL,
    customer_id integer,
    product_id integer,
    quantity integer DEFAULT 1,
    added_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT cartitem_quantity_check CHECK ((quantity > 0))
);


ALTER TABLE public.cartitem OWNER TO postgres;

--
-- Name: cartitem_cart_item_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.cartitem_cart_item_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.cartitem_cart_item_id_seq OWNER TO postgres;

--
-- Name: cartitem_cart_item_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.cartitem_cart_item_id_seq OWNED BY public.cartitem.cart_item_id;


--
-- Name: cd; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cd (
    product_id integer NOT NULL,
    artist character varying(255),
    record_label character varying(255),
    track_list text,
    genre character varying(255)
);


ALTER TABLE public.cd OWNER TO postgres;

--
-- Name: customer; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.customer (
    customer_id integer NOT NULL,
    name character varying(255),
    email character varying(100),
    phone character varying(20),
    address text,
    pass_word text
);


ALTER TABLE public.customer OWNER TO postgres;

--
-- Name: customer_customer_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.customer_customer_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.customer_customer_id_seq OWNER TO postgres;

--
-- Name: customer_customer_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.customer_customer_id_seq OWNED BY public.customer.customer_id;


--
-- Name: dvd; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.dvd (
    product_id integer NOT NULL,
    director character varying(255),
    duration integer,
    disc_type character varying(255),
    language character varying(255),
    subtitle text
);


ALTER TABLE public.dvd OWNER TO postgres;

--
-- Name: orderitem; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.orderitem (
    order_item_id integer NOT NULL,
    order_id integer,
    product_id integer,
    quantity integer,
    price numeric(10,2)
);


ALTER TABLE public.orderitem OWNER TO postgres;

--
-- Name: orderitem_order_item_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.orderitem_order_item_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.orderitem_order_item_id_seq OWNER TO postgres;

--
-- Name: orderitem_order_item_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.orderitem_order_item_id_seq OWNED BY public.orderitem.order_item_id;


--
-- Name: orders; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.orders (
    order_id integer NOT NULL,
    customer_id integer,
    order_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    total_amount numeric(10,2),
    status character varying(50) DEFAULT 'pending'::character varying
);


ALTER TABLE public.orders OWNER TO postgres;

--
-- Name: orders_order_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.orders_order_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.orders_order_id_seq OWNER TO postgres;

--
-- Name: orders_order_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.orders_order_id_seq OWNED BY public.orders.order_id;


--
-- Name: product; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.product (
    product_id integer NOT NULL,
    title character varying(255) NOT NULL,
    price numeric(10,2) NOT NULL,
    release_date date,
    product_type public.product_type_enum NOT NULL,
    created_by integer
);


ALTER TABLE public.product OWNER TO postgres;

--
-- Name: product_product_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.product_product_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.product_product_id_seq OWNER TO postgres;

--
-- Name: product_product_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.product_product_id_seq OWNED BY public.product.product_id;


--
-- Name: productmanager; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.productmanager (
    manager_id integer NOT NULL,
    name character varying(255),
    email character varying(100),
    pass_word text
);


ALTER TABLE public.productmanager OWNER TO postgres;

--
-- Name: productmanager_manager_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.productmanager_manager_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.productmanager_manager_id_seq OWNER TO postgres;

--
-- Name: productmanager_manager_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.productmanager_manager_id_seq OWNED BY public.productmanager.manager_id;


--
-- Name: vnpaytransaction; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.vnpaytransaction (
    transaction_id integer NOT NULL,
    order_id integer,
    vnp_txn_ref character varying(100),
    payment_time timestamp without time zone,
    amount numeric(10,2),
    status character varying(50)
);


ALTER TABLE public.vnpaytransaction OWNER TO postgres;

--
-- Name: vnpaytransaction_transaction_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.vnpaytransaction_transaction_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.vnpaytransaction_transaction_id_seq OWNER TO postgres;

--
-- Name: vnpaytransaction_transaction_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.vnpaytransaction_transaction_id_seq OWNED BY public.vnpaytransaction.transaction_id;


--
-- Name: cartitem cart_item_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cartitem ALTER COLUMN cart_item_id SET DEFAULT nextval('public.cartitem_cart_item_id_seq'::regclass);


--
-- Name: customer customer_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.customer ALTER COLUMN customer_id SET DEFAULT nextval('public.customer_customer_id_seq'::regclass);


--
-- Name: orderitem order_item_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orderitem ALTER COLUMN order_item_id SET DEFAULT nextval('public.orderitem_order_item_id_seq'::regclass);


--
-- Name: orders order_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders ALTER COLUMN order_id SET DEFAULT nextval('public.orders_order_id_seq'::regclass);


--
-- Name: product product_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product ALTER COLUMN product_id SET DEFAULT nextval('public.product_product_id_seq'::regclass);


--
-- Name: productmanager manager_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.productmanager ALTER COLUMN manager_id SET DEFAULT nextval('public.productmanager_manager_id_seq'::regclass);


--
-- Name: vnpaytransaction transaction_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vnpaytransaction ALTER COLUMN transaction_id SET DEFAULT nextval('public.vnpaytransaction_transaction_id_seq'::regclass);


--
-- Data for Name: book; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.book (product_id, author, publisher, page_count) FROM stdin;
\.


--
-- Data for Name: cartitem; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cartitem (cart_item_id, customer_id, product_id, quantity, added_at) FROM stdin;
\.


--
-- Data for Name: cd; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cd (product_id, artist, record_label, track_list, genre) FROM stdin;
\.


--
-- Data for Name: customer; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.customer (customer_id, name, email, phone, address, pass_word) FROM stdin;
\.


--
-- Data for Name: dvd; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.dvd (product_id, director, duration, disc_type, language, subtitle) FROM stdin;
\.


--
-- Data for Name: orderitem; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.orderitem (order_item_id, order_id, product_id, quantity, price) FROM stdin;
\.


--
-- Data for Name: orders; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.orders (order_id, customer_id, order_date, total_amount, status) FROM stdin;
\.


--
-- Data for Name: product; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.product (product_id, title, price, release_date, product_type, created_by) FROM stdin;
\.


--
-- Data for Name: productmanager; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.productmanager (manager_id, name, email, pass_word) FROM stdin;
\.


--
-- Data for Name: vnpaytransaction; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.vnpaytransaction (transaction_id, order_id, vnp_txn_ref, payment_time, amount, status) FROM stdin;
\.


--
-- Name: cartitem_cart_item_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.cartitem_cart_item_id_seq', 1, false);


--
-- Name: customer_customer_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.customer_customer_id_seq', 1, false);


--
-- Name: orderitem_order_item_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.orderitem_order_item_id_seq', 1, false);


--
-- Name: orders_order_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.orders_order_id_seq', 1, false);


--
-- Name: product_product_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.product_product_id_seq', 1, false);


--
-- Name: productmanager_manager_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.productmanager_manager_id_seq', 1, false);


--
-- Name: vnpaytransaction_transaction_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.vnpaytransaction_transaction_id_seq', 1, false);


--
-- Name: book book_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.book
    ADD CONSTRAINT book_pkey PRIMARY KEY (product_id);


--
-- Name: cartitem cartitem_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cartitem
    ADD CONSTRAINT cartitem_pkey PRIMARY KEY (cart_item_id);


--
-- Name: cd cd_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cd
    ADD CONSTRAINT cd_pkey PRIMARY KEY (product_id);


--
-- Name: customer customer_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.customer
    ADD CONSTRAINT customer_email_key UNIQUE (email);


--
-- Name: customer customer_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.customer
    ADD CONSTRAINT customer_pkey PRIMARY KEY (customer_id);


--
-- Name: dvd dvd_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.dvd
    ADD CONSTRAINT dvd_pkey PRIMARY KEY (product_id);


--
-- Name: orderitem orderitem_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orderitem
    ADD CONSTRAINT orderitem_pkey PRIMARY KEY (order_item_id);


--
-- Name: orders orders_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_pkey PRIMARY KEY (order_id);


--
-- Name: product product_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product
    ADD CONSTRAINT product_pkey PRIMARY KEY (product_id);


--
-- Name: productmanager productmanager_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.productmanager
    ADD CONSTRAINT productmanager_email_key UNIQUE (email);


--
-- Name: productmanager productmanager_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.productmanager
    ADD CONSTRAINT productmanager_pkey PRIMARY KEY (manager_id);


--
-- Name: vnpaytransaction vnpaytransaction_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vnpaytransaction
    ADD CONSTRAINT vnpaytransaction_pkey PRIMARY KEY (transaction_id);


--
-- Name: vnpaytransaction vnpaytransaction_vnp_txn_ref_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vnpaytransaction
    ADD CONSTRAINT vnpaytransaction_vnp_txn_ref_key UNIQUE (vnp_txn_ref);


--
-- Name: book book_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.book
    ADD CONSTRAINT book_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.product(product_id);


--
-- Name: cartitem cartitem_customer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cartitem
    ADD CONSTRAINT cartitem_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.customer(customer_id);


--
-- Name: cartitem cartitem_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cartitem
    ADD CONSTRAINT cartitem_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.product(product_id);


--
-- Name: cd cd_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cd
    ADD CONSTRAINT cd_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.product(product_id);


--
-- Name: dvd dvd_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.dvd
    ADD CONSTRAINT dvd_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.product(product_id);


--
-- Name: orderitem orderitem_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orderitem
    ADD CONSTRAINT orderitem_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(order_id);


--
-- Name: orderitem orderitem_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orderitem
    ADD CONSTRAINT orderitem_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.product(product_id);


--
-- Name: orders orders_customer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.customer(customer_id);


--
-- Name: product product_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product
    ADD CONSTRAINT product_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.productmanager(manager_id);


--
-- Name: vnpaytransaction vnpaytransaction_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vnpaytransaction
    ADD CONSTRAINT vnpaytransaction_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(order_id);


--
-- PostgreSQL database dump complete
--

