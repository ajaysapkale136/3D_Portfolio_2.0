package com.ajay.portfolio.security;

import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.net.InetAddress;
import java.util.Arrays;
import java.util.Set;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

/**
 * Secure IP resolution component.
 * Prevents IP spoofing by trusting forwarding headers ONLY when the immediate
 * connection originates from an explicitly configured reverse proxy (e.g. Vercel, Cloudflare, NGINX).
 */
@Component
public class ClientIpResolver {

    private static final Logger log = LoggerFactory.getLogger(ClientIpResolver.class);

    private static final Pattern IPV4_PATTERN = Pattern.compile(
            "^((25[0-5]|(2[0-4]|1\\d|[1-9]|)\\d)\\.){3}(25[0-5]|(2[0-4]|1\\d|[1-9]|)\\d)$"
    );

    @Value("${app.security.trusted-proxies:127.0.0.1,0:0:0:0:0:0:0:1,::1,10.0.0.0/8,172.16.0.0/12,192.168.0.0/16}")
    private String trustedProxiesConfig;

    @Value("${app.security.trust-forwarded-headers:true}")
    private boolean trustForwardedHeaders;

    public String resolveClientIp(HttpServletRequest request) {
        if (request == null) {
            return "127.0.0.1";
        }

        String remoteAddr = request.getRemoteAddr();
        if (remoteAddr == null || remoteAddr.isBlank()) {
            remoteAddr = "127.0.0.1";
        }

        // If forwarding header trust is disabled or remote connection is not from a trusted proxy,
        // use the socket remote address directly to prevent header spoofing attacks.
        if (!trustForwardedHeaders || !isTrustedProxy(remoteAddr)) {
            return cleanIp(remoteAddr);
        }

        // Connection is from a trusted proxy; safely inspect X-Forwarded-For
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isBlank()) {
            String[] ips = xForwardedFor.split(",");
            // Iterate from left to right to find the originating client IP
            for (String ip : ips) {
                String candidate = ip.trim();
                if (isValidIp(candidate) && !isTrustedProxy(candidate)) {
                    return candidate;
                }
            }
            // Fallback to first valid entry in chain
            String first = ips[0].trim();
            if (isValidIp(first)) {
                return first;
            }
        }

        String xRealIp = request.getHeader("X-Real-IP");
        if (xRealIp != null && !xRealIp.isBlank() && isValidIp(xRealIp.trim())) {
            return xRealIp.trim();
        }

        return cleanIp(remoteAddr);
    }

    private boolean isTrustedProxy(String ip) {
        if (ip == null || ip.isBlank()) return false;
        String clean = cleanIp(ip);

        if (clean.equals("127.0.0.1") || clean.equals("0:0:0:0:0:0:0:1") || clean.equals("::1")) {
            return true;
        }

        Set<String> configured = Arrays.stream(trustedProxiesConfig.split(","))
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .collect(Collectors.toSet());

        if (configured.contains(clean)) {
            return true;
        }

        // Check private network ranges: 10.x.x.x, 192.168.x.x, 172.16-31.x.x
        return clean.startsWith("10.") ||
               clean.startsWith("192.168.") ||
               (clean.startsWith("172.") && isPrivate172(clean));
    }

    private boolean isPrivate172(String ip) {
        try {
            String[] parts = ip.split("\\.");
            if (parts.length >= 2) {
                int second = Integer.parseInt(parts[1]);
                return second >= 16 && second <= 31;
            }
        } catch (Exception ignored) {}
        return false;
    }

    private boolean isValidIp(String ip) {
        if (ip == null || ip.isBlank() || ip.length() > 45) return false;
        if (IPV4_PATTERN.matcher(ip).matches()) return true;
        try {
            InetAddress addr = InetAddress.getByName(ip);
            return addr != null;
        } catch (Exception ex) {
            return false;
        }
    }

    private String cleanIp(String ip) {
        if (ip.startsWith("/")) return ip.substring(1).trim();
        return ip.trim();
    }
}
