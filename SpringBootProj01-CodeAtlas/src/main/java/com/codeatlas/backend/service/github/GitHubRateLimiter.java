
package com.codeatlas.backend.service.github;

import java.time.Duration;
import java.util.concurrent.Semaphore;
import java.util.concurrent.atomic.AtomicLong;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class GitHubRateLimiter {

    private final Semaphore permits;
    private final long minIntervalMillis;
    private final AtomicLong lastRequestTime = new AtomicLong(0);

    public GitHubRateLimiter(
            @Value("${app.github.rate-limit.max-concurrent:2}")
            int maxConcurrent,

            @Value("${app.github.rate-limit.min-interval-ms:200}")
            long minIntervalMillis) {

        if (maxConcurrent < 1) {
            throw new IllegalArgumentException(
                    "maxConcurrent must be at least 1");
        }

        if (minIntervalMillis < 0) {
            throw new IllegalArgumentException(
                    "minIntervalMillis cannot be negative");
        }

        this.permits = new Semaphore(maxConcurrent);
        this.minIntervalMillis = minIntervalMillis;
    }

    /**
     * Acquires permission to make a GitHub API request.
     * Call release() in a finally block after the request completes.
     */
    public void acquire() throws InterruptedException {
        permits.acquire();

        try {
            waitForNextRequest();
        } catch (InterruptedException e) {
            permits.release();
            Thread.currentThread().interrupt();
            throw e;
        } catch (RuntimeException e) {
            permits.release();
            throw e;
        }
    }

    /**
     * Releases a permit after the API request finishes.
     */
    public void release() {
        permits.release();
    }

    private void waitForNextRequest() throws InterruptedException {
        while (true) {
            long now = System.currentTimeMillis();
            long previous = lastRequestTime.get();
            long nextAllowed = previous + minIntervalMillis;

            if (now < nextAllowed) {
                Thread.sleep(nextAllowed - now);
                continue;
            }

            if (lastRequestTime.compareAndSet(previous, now)) {
                return;
            }
        }
    }
}
