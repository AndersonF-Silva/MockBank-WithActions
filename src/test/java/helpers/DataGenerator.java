package helpers;

import java.util.UUID;

public class DataGenerator {
    public static String getRandomString() {
        return UUID.randomUUID().toString();
    }
}
