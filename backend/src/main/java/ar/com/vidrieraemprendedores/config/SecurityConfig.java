package ar.com.vidrieraemprendedores.config;

import ar.com.vidrieraemprendedores.security.JwtAuthenticationFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthFilter;
    private final AuthenticationProvider authenticationProvider;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthFilter, AuthenticationProvider authenticationProvider) {
        this.jwtAuthFilter = jwtAuthFilter;
        this.authenticationProvider = authenticationProvider;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth
                // ✅ 1. Endpoints públicos de autenticación (DEBE IR PRIMERO)
                // Aceptamos tanto /auth/** como /api/auth/** por si acaso
                .requestMatchers("/auth/**", "/api/auth/**", "/login", "/api/login").permitAll()
                
                // ✅ 2. Endpoints públicos de lectura (GET)
                .requestMatchers(HttpMethod.GET, 
                    "/api/productos/**", 
                    "/api/fotos/**",
                    "/api/categorias/**",
                    "/api/emprendedores/**"
                ).permitAll()
                
                // ✅ 3. Endpoints públicos para estadísticas y moderación
                .requestMatchers("/api/admin/stats").permitAll()
                .requestMatchers("/api/admin/moderacion/**", "/api/admin/notificaciones/**").permitAll()

                // ✅ 4. Endpoints exclusivos para ADMINISTRADOR (Usamos hasAnyAuthority para evitar conflictos de prefijos)
                .requestMatchers("/api/admin/**").hasAnyAuthority("ADMIN", "ROLE_ADMIN", "SUPER_ADMIN", "ROLE_SUPER_ADMIN")

                // ✅ 5. Endpoints exclusivos para EMPRENDEDOR
                .requestMatchers("/api/emprendedor/**").hasAnyAuthority("EMPRENDEDOR", "ROLE_EMPRENDEDOR", "ADMIN", "ROLE_ADMIN", "SUPER_ADMIN", "ROLE_SUPER_ADMIN")
                
                // ✅ 6. Gestión de productos autenticada
                .requestMatchers(HttpMethod.POST, "/api/productos").authenticated()
                .requestMatchers(HttpMethod.POST, "/api/productos/con-foto").authenticated()
                .requestMatchers(HttpMethod.PUT, "/api/productos/**").authenticated()
                .requestMatchers(HttpMethod.DELETE, "/api/productos/**").authenticated()
                
                // ✅ 7. Cualquier otra petición requiere autenticación
                .anyRequest().authenticated()
            )
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authenticationProvider(authenticationProvider)
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of("http://localhost:5173"));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setExposedHeaders(List.of("Authorization"));
        configuration.setAllowCredentials(true);
        configuration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}