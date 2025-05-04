class CartControllerTest {

    private CartController cartController;
    private CartRepository cartRepo;
    private ProductRepository productRepo;

    @BeforeEach
    void setup() {
        cartRepo = Mockito.mock(CartRepository.class);
        productRepo = Mockito.mock(ProductRepository.class);
        cartController = new CartController(cartRepo, productRepo);
    }

    @Test
    void addNewItem_shouldAddProductToCart() {
        Product book = new Product(101, "Book", BigDecimal.valueOf(10));
        Cart cart = new Cart();

        when(productRepo.findById(101)).thenReturn(book);
        when(cartRepo.findByCustomerId(1)).thenReturn(cart);

        cartController.addItem(1, 101, 2);

        assertEquals(1, cart.getItems().size());
        assertEquals(2, cart.getItems().get(0).getQuantity());
    }

    @Test
    void addItem_zeroQuantity_shouldThrowException() {
        assertThrows(IllegalArgumentException.class, () -> {
            cartController.addItem(1, 101, 0);
        });
    }

    @Test
    void addItem_negativeQuantity_shouldThrowException() {
        assertThrows(IllegalArgumentException.class, () -> {
            cartController.addItem(1, 101, -3);
        });
    }
}
