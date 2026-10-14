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
                // ✅ PRIMERO: Endpoints públicos de autenticación (DEBE IR ANTES QUE CUALQUIER OTRO)
                .requestMatchers("/auth/**", "/api/auth/**").permitAll()
                
                // Endpoints públicos de lectura
                .requestMatchers(HttpMethod.GET, 
                    "/api/productos/**", 
                    "/api/fotos/**",
                    "/api/categorias/**",
                    "/api/emprendedores/**"
                ).permitAll()
                
                // Endpoints públicos para estadísticas del admin dashboard
                .requestMatchers("/api/admin/stats").permitAll()
                
                // Moderación y notificaciones (pueden ser públicas o protegidas según necesites)
                .requestMatchers("/api/admin/moderacion/**", "/api/admin/notificaciones/**").permitAll()

                // ✅ Endpoints exclusivos para ADMINISTRADOR
                .requestMatchers("/api/admin/**").hasAnyRole("ADMIN", "SUPER_ADMIN")

                // ✅ Endpoints exclusivos para EMPRENDEDOR
                .requestMatchers("/api/emprendedor/**").hasRole("EMPRENDEDOR")
                
                // ✅ Cualquier otra petición requiere autenticación
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
        configuration.setAllowedHeaders(List.of("*")); // ✅ Permitir todos los headers
        configuration.setExposedHeaders(List.of("Authorization")); // ✅ Exponer Authorization
        configuration.setAllowCredentials(true);
        configuration.setMaxAge(3600L); // ✅ Cachear preflight por 1 hora

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}