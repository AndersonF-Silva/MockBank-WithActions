package mockbank;

import com.intuit.karate.Results;
import com.intuit.karate.Runner;
import static org.junit.jupiter.api.Assertions.*;
import org.junit.jupiter.api.Test;

class UiTestRunner {

    @Test
    void testUiParallel() {
        Results results = Runner.path("classpath:mockbank/ui")
                .tags("@ui", "~@ignore")
                .parallel(1);
        assertEquals(0, results.getFailCount(), results.getErrorMessages());
    }
}
