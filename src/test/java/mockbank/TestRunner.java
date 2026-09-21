package mockbank;

import com.intuit.karate.Results;
import com.intuit.karate.Runner;
import static org.junit.jupiter.api.Assertions.*;
import org.junit.jupiter.api.Test;

class TestRunner {

    @Test
    void testParallel() {
        Results results = Runner.path("classpath:mockbank")
                .tags("~@ignore") // Ignora cenários ou features marcados com @ignore
                .parallel(2);
        assertEquals(0, results.getFailCount(), results.getErrorMessages());
    }
}
