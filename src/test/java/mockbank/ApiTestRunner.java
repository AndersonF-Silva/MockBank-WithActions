package mockbank;

import com.intuit.karate.Results;
import com.intuit.karate.Runner;
import static org.junit.jupiter.api.Assertions.*;
import org.junit.jupiter.api.Test;

class ApiTestRunner {

    @Test
    void testApiParallel() {
        Results results = Runner.path("classpath:mockbank/api")
                .tags("@api", "~@ignore")
                .parallel(1);
        assertEquals(0, results.getFailCount(), results.getErrorMessages());
    }
}
